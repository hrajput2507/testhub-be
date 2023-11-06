import { get_signed_token, match_password } from "../../utils/auth.util.js";
import user_type from "../../../config/user_type.js";
import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";

export const login = async_handler(async (req, res, next) => {
  const { type, email, password } = req.body;

  if (!type) {
    return next(new ErrorResponse(`Type is missing`, 200));
  }
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 200));
  }

  if (type == user_type.staff) {
    return staff_login(req, res, next);
  }

  if (type == user_type.teacher) {
    return teacher_login(req, res, next);
  }

  return next(
    new ErrorResponse(
      `Acceptable type: ${user_type.staff} | ${user_type.teacher} | ${user_type.student}`,
      400
    )
  );
});

/**
 * Funtion to login teacher
 */
const teacher_login = async_handler(async (req, res, next) => {
  const { type, email, password } = req.body;

  const teacher = await db_connection.user_teacher_model.findOne({
    where: { email },
  });

  if (!teacher) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const is_matched = await match_password(password, teacher.password);

  if (!is_matched) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const token = get_signed_token(teacher.teacher_id);

  /* Associating teachers and academy */
  db_connection.user_teacher_model.hasOne(db_connection.academy_model, {
    sourceKey: "academy_id",
    foreignKey: "academy_id",
  });

  const teacher_data = await db_connection.user_teacher_model.findAll({
    attributes: [
      "teacher_id",
      "first_name",
      "last_name",
      "email",
      "avatar",
      "bio",
      "roles",
    ],
    where: {
      email,
    },
    include: {
      model: db_connection.academy_model,
    },
  });

  res
    .status(200)
    .json({ success: true, data: { type, token, user: teacher_data[0] } });
});

/**
 * Funtion to login staff
 */
const staff_login = async_handler(async (req, res, next) => {
  const { type, email, password } = req.body;

  const staff = await db_connection.user_staff_model.findOne({
    where: { email },
  });

  if (!staff) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const is_matched = await match_password(password, staff.password);

  if (!is_matched) {
    return next(new ErrorResponse("Invalid credentials", 200));
  }

  const token = get_signed_token(staff.staff_id);

  const staff_data = {
    first_name: staff.first_name,
    last_name: staff.last_name,
    email: email,
    role: staff.role,
    bio: staff.bio,
    avatar: staff.avatar,
  };

  res
    .status(200)
    .json({ success: true, data: { type, token, user: staff_data } });
});
