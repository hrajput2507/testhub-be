import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import * as dotenv from "dotenv";
import passport from "passport";
import cookieSession from "cookie-session";
import session from "express-session";
import passportSetup from "./passport.js";
import router from "./src/routes/index.routes.js";
import { cors_options } from "./config/cors.js";
import { error_handler } from "./src/middlewares/error.middleware.js";
import db_connection from "./src/models/index.js"
import { get_signed_token, hashed_password } from "./src/utils/auth.util.js";


/* configuring .env via dotenv */
dotenv.config();

/* Initialising the express application */
const app = express();

/* Using express middlewares on app */
app.use(cors(cors_options));
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
// app.use(session({
//   secret: 'testkart',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))
app.use(cookieSession({
  name: 'session',
  keys: ["testkart"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize());
app.use(passport.session());

/* Registering index router */
app.use("/api/v1/", router);

/* index route for error and index web route */
app.get("/", (req, res) => res.json({}));

/**************************************Login with google***********************************/

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: "/auth/login/failed"
}));

app.get("/auth/login/success", async (req, res) => {
  if (req.user) {
    const name = req.user.displayName;
    const email = req.user.emails[0].value;

    let student = await db_connection.user_student_model.findOne({
      where: { email },
    });

    if (!student) {
      student = await db_connection.user_student_model.create({
        name,
        email,
      });
      await db_connection.student_preferences_model.create({
        student_id: student.dataValues.student_id,
      });
    }

    const token = get_signed_token(student.dataValues.student_id);

    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
      token: token,
      student: student
    });
  }
  else {
    res.status(403).json({
      error: true,
      message: "Not Authorized"
    });
  }
});
app.get("auth/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure"
  });
});

app.get("/auth/logout", (req, res) => {
  req.logOut();
  res.redirect(process.env.CLIENT_URL);
});

/********************************End Google Login***************************************************/

/* Error handler middleware */
app.use(error_handler);

/* PORT and listening app */
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server started on port [${port}] - http://localhost:${port}`);
});
