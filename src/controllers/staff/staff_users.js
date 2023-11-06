import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import { hashed_password } from "../../utils/auth.util.js";

/**
 * Get all staffs
 */
export const staffs = async_handler(async (req, res, next) => {
  let sql = `SELECT us.staff_id,us.first_name,us.last_name,us.email,us.roles,us.avatar,us.bio  FROM user_staff AS us`;

  const staffs = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!staffs) {
    return next(new ErrorResponse(`Unable to fetch staffs`, 200));
  }

  staffs.forEach((staff) => {
    staff.roles = JSON.parse(staff.roles);
  });

  res.status(200).json({ success: true, data: staffs });
});

/**
 * Add new staff user
 */
export const add_staff = async_handler(async (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  let { password, roles } = req.body;

  if (!first_name || !last_name || !email || !roles) {
    return next(new ErrorResponse(`Required fields are missing`, 200));
  }
  if (!password) {
    return next(new ErrorResponse(`Password is missing`, 200));
  }

  password = await hashed_password(password);
  roles = JSON.stringify(roles);
  const staff = await db_connection.user_staff_model.create({
    first_name,
    last_name,
    email,
    password,
    roles,
  });

  res.status(200).json({ success: true, data: staff });
});

/**
 * Add new staff user
 */
export const update_staff = async_handler(async (req, res, next) => {
  const staff_id = req.params.id;
  const { first_name, last_name, email } = req.body;
  let { password, roles } = req.body;

  let updated_values = {};

  const user = await db_connection.user_staff_model.findOne({
    where: { staff_id: staff_id },
  });

  if (!user) {
    return next(new ErrorResponse(`Trying to update invalid staff user`, 200));
  }

  if (!first_name || !last_name || !email || !roles) {
    return next(new ErrorResponse(`Required fields are missing`, 200));
  }

  updated_values.first_name = first_name;
  updated_values.last_name = last_name;
  updated_values.email = email;
  updated_values.roles = JSON.stringify(roles);
  updated_values.password = user.password;

  if (password) {
    password = await hashed_password(password);
    updated_values.password = password;
  }

  const staff = await db_connection.user_staff_model.update(
    { ...updated_values },
    { where: { staff_id: staff_id } }
  );
  if (!staff[0]) {
    return next(new ErrorResponse("Unable to update staff user", 200));
  }

  res.status(200).json({ success: true, data: {} });
});

/**
 * Get staffs profile
 */
export const staff_profile = async_handler(async (req, res, next) => {

  let sql = `SELECT us.staff_id,us.first_name,us.last_name,us.email,us.designation,us.avatar,us.bio FROM user_staff AS us WHERE staff_id = ${req.user.staff_id}`;

  const staffs = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!staffs) {
    return next(new ErrorResponse(`Unable to fetch user staff data`, 200));
  }

  res.status(200).json({ success: true, data: staffs[0] });
});

/**
 * Update staff profile
 */
export const update_staff_profile = async_handler(async (req, res, next) => {
  const { staff_id, first_name, last_name, designation, bio } = req.body;

  let updated_values = {};

  const user = await db_connection.user_staff_model.findOne({
    where: { staff_id: staff_id },
  });

  if (!user) {
    return next(new ErrorResponse(`Trying to update invalid staff user`, 200));
  }

  if (!first_name || !last_name || !designation || !bio) {
    return next(new ErrorResponse(`Required fields are missing`, 200));
  }

  updated_values.first_name = first_name;
  updated_values.last_name = last_name;
  updated_values.designation = designation;
  updated_values.bio = bio;

  const staff = await db_connection.user_staff_model.update(
    { ...updated_values },
    { where: { staff_id: staff_id } }
  );
  if (!staff[0]) {
    return next(new ErrorResponse("Unable to update staff user", 200));
  }

  res.status(200).json({ success: true, data: {} });
});
