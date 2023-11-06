import jwt from "jsonwebtoken";
import async_handler from "./async.middleware.js";
import db_connection from "../models/index.js";
import ErrorResponse from "../utils/error.util.js";
import user_type from "../../config/user_type.js";

export const protect = async_handler(async (req, res, next) => {
  let token;

  if (!req.headers.user_type) {
    return next(new ErrorResponse("user_type is missing in header", 401));
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_type = req.headers.user_type;

    if (req.user_type == user_type.staff) {
      const staff = await db_connection.user_staff_model.findOne({
        where: { staff_id: decoded.id },
      });
      req.user = staff.dataValues;
    } else if (req.user_type == user_type.teacher) {
      const teacher = await db_connection.user_teacher_model.findOne({
        where: { teacher_id: decoded.id },
      });
      req.user = teacher.dataValues;
    } else if (req.user_type == user_type.student) {
      const student = await db_connection.user_student_model.findOne({
        where: { student_id: decoded.id },
      });
      req.user = student.dataValues;
      const student_preferences =
        await db_connection.student_preferences_model.findOne({
          where: { student_id: decoded.id },
        });
      req.student_preferences = student_preferences.dataValues;
    } else {
      console.log("req.user_type", req.user_type);
      return next(new ErrorResponse("Not valid user type", 401));
    }
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`${req.user.role} is not authorized`, 403));
    }
    next();
  };
};
