import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

/**
 * Profile settings
 */

export const get_student_profile = async_handler(async (req, res, next) => {
  const student_raw_data = await db_connection.user_student_model.findOne({
    where: { student_id: req.user.student_id },
  });

  if (!student_raw_data) {
    return next(new ErrorResponse("Invalid user", 200));
  }

  const student_data = {
    name: student_raw_data.name,
    email: student_raw_data.email,
    avatar: student_raw_data.avatar,
  };

  return _response(res, 200, true, "Student data", student_data);
});

export const update_student_profile = async_handler(async (req, res, next) => {
  let update_values = {};

  const { name, email, avatar } = req.body;

  const student_raw_data = await db_connection.user_student_model.findOne({
    where: { student_id: req.user.student_id },
  });

  if (!student_raw_data) {
    return next(new ErrorResponse("Invalid user", 200));
  }

  if (name) {
    update_values.name = name;
  }

  if (email && email !== student_raw_data.dataValues.email) {
    update_values.email = email;
    update_values.is_verified = "false";
  }
  if (avatar) {
    update_values.avatar = avatar;
  }

  const updated_student = await db_connection.user_student_model.update(
    { ...update_values },
    { where: { student_id: req.user.student_id } }
  );

  if (!updated_student[0]) {
    console.log("not updated");
    return next(new ErrorResponse("Unable to update", 200));
  }

  const user = await db_connection.user_student_model.findOne({
    where: { student_id: req.user.student_id },
  });

  const user_data = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    is_verified: user.is_verified,
  };

  return _response(res, 200, true, "Student profile updated", user_data);
});

/**
 * Student preferences
 */

export const get_student_preferences = async_handler(async (req, res, next) => {
  const student_preferences =
    await db_connection.student_preferences_model.findOne({
      where: { student_id: req.user.student_id },
    });

  if (!student_preferences) {
    return next(new ErrorResponse("Invalid user", 200));
  }

  return _response(res, 200, true, "Student data", student_preferences);
});

export const update_student_preferences = async_handler(
  async (req, res, next) => {
    let update_values = {};

    const {
      exams,
      whatsapp_notification,
      sms_notification,
      email_notification,
    } = req.body;

    const student = await db_connection.student_preferences_model.findOne({
      where: { student_id: req.user.student_id },
    });

    if (!student) {
      return next(new ErrorResponse("Invalid user", 200));
    }

    if (exams) {
      update_values.exams = JSON.stringify(exams);
    }

    if (whatsapp_notification) {
      update_values.whatsapp_notification = +whatsapp_notification;
    }

    if (sms_notification) {
      update_values.sms_notification = +sms_notification;
    }

    if (email_notification) {
      update_values.email_notification = +email_notification;
    }

    const updated_student_preferences =
      await db_connection.student_preferences_model.update(
        { ...update_values },
        { where: { student_id: req.user.student_id } }
      );

    if (!updated_student_preferences[0]) {
      console.log("not updated");
      return next(new ErrorResponse("Unable to update", 200));
    }

    return _response(res, 200, true, "Student preferences updated", {});
  }
);
