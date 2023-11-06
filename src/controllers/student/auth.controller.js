import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import {
  get_signed_token,
  hashed_password,
  match_password,
} from "../../utils/auth.util.js";
import _response from "../../utils/response.util.js";

/**
 * Funtion to signup student
 */

export const student_signup = async_handler(async (req, res, next) => {
  let { name, email, password } = req.body;

  password = await hashed_password(password);

  const student = await db_connection.user_student_model.create({
    name,
    email,
    password,
  });

  const student_preferences =
    await db_connection.student_preferences_model.create({
      student_id: student.dataValues.student_id,
    });

  const token = get_signed_token(student.dataValues.student_id);

  return _response(res, 200, true, "Student Registred", {
    token,
    student,
    student_preferences,
  });
});

/**
 * Funtion to login student
 */
export const student_login = async_handler(async (req, res, next) => {
  const { email, password } = req.body;

  const student = await db_connection.user_student_model.findOne({
    where: { email },
  });

  if (!student) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const is_matched = await match_password(password, student.password);

  if (!is_matched) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const token = get_signed_token(student.student_id);

  const tusent_data = {
    name: student.name,
    email: email,
    avatar: student.avatar,
    is_verified: student.is_verified,
  };

  return _response(res, 200, true, "Student logged in successfully !", {
    token,
    user: tusent_data,
  });
});
