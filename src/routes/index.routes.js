import express from "express";
import me_router from "./me.routes.js";
import auth_router from "./auth.routes.js";
import exam_router from "./exam.routes.js";
import blog_router from "./blog.routes.js";
import staff_user_routes from "./staff/user.routes.js";
import teacher_user_routes from "./studio/teacher.routes.js";
import academy_routes from "./studio/academy.routes.js";
import test_series_router from "./test_series/test_series.routes.js";
import test_router from "./test_series/test.routes.js";
import question_router from "./test_series/question.routes.js";
import app_exam_router from "./test_kart/exams.routes.js";
import app_home_router from "./test_kart/index.routes.js";
import app_blogs_router from "./test_kart/blogs.routes.js";
import file_router from "./files.routes.js";
import faq_router from "./settings/faq.routes.js";
import studio_dashboard_routes from "./studio/dashboard.routes.js";
import student_router from "./student/student.routes.js";
import app_series_router from "./test_kart/series.routes.js";
import app_leads_router from "./test_kart/leads.routes.js";
import contact_router from "./studio/contact.routes.js";
import cart_router from "./test_kart/cart.routes.js";
import passport from "passport";

const router = express.Router();

// health check route for v1
router.get("/healthcheck", (_, res) => res.sendStatus(200));

// authentication route

router.use("/auth", auth_router);
router.use(me_router);

router.use("/exams", exam_router);
router.use("/blogs", blog_router);

/* TestKart app api routes */
router.use("/app/home", app_home_router);
router.use("/app/exams", app_exam_router);
router.use("/app/blogs", app_blogs_router);
router.use("/app/test-series", app_series_router);
router.use("/app/cart/", cart_router)

/* Leads api routes */
router.use("/leads", app_leads_router);

/* Student api routes */
router.use("/student", student_router);

/* Staff api routes */
router.use("/staffs/users", staff_user_routes);

/* Files api routes */
router.use("/files", file_router);

/* Studio */
router.use("/studio/teachers", teacher_user_routes);
router.use("/studio/academy", academy_routes);
router.use("/studio/dashboard", studio_dashboard_routes);

/* Test Series API */
router.use("/test-series/test/question", question_router);
router.use("/test-series/test", test_router);
router.use("/test-series", test_series_router);

/* Setting api routes */
router.use("/settings/faq", faq_router);

/* contact us api routes */
router.use("/contact/", contact_router);




export default router;
