import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import ErrorResponse from '../../utils/error.util.js';
import { hashed_password } from '../../utils/auth.util.js';

/**
 * Get all teachers
 */
export const teachers = async_handler(async (req, res, next) => {

    let academy_id = req.query.academy_id;

    let sql = `SELECT ut.teacher_id,ut.first_name,ut.last_name,ut.email,ut.roles,ut.avatar,ut.bio,ut.academy_id,ac.display_name  FROM user_teacher AS ut LEFT JOIN academy as ac ON ac.academy_id = ut.academy_id `;

    if (academy_id) {
        sql += ` WHERE ut.academy_id = ${academy_id} `
    }

    const teachers = await db_connection.sequelize.query(sql, { type: db_connection.sequelize.QueryTypes.SELECT });

    if (!teachers) {
        return next(new ErrorResponse(`Unable to fetch teachers`, 200));
    }

    teachers.forEach((staff) => {
        staff.roles = JSON.parse(staff.roles)
    });

    res.status(200).json({ success: true, data: teachers });

});

/**
 * Add new teacher
 */
export const add_teacher = async_handler(async (req, res, next) => {

    const { first_name, last_name, email, academy_id } = req.body;
    let { password, roles } = req.body;

    if (!first_name || !last_name || !email || !roles || !academy_id) {
        return next(new ErrorResponse(`Required fields are missing`, 200));
    }
    if (!password) {
        return next(new ErrorResponse(`Password is missing`, 200));
    }

    password = await hashed_password(password);
    roles = JSON.stringify(roles);
    const staff = await db_connection.user_teacher_model.create({ first_name, last_name, email, password, roles, academy_id });

    res.status(200).json({ success: true, data: staff });

});

/**
 * Update a teacher
 */
export const update_teacher = async_handler(async (req, res, next) => {

    const teacher_id = req.params.id;
    const { first_name, last_name, email } = req.body;
    let { password, roles } = req.body;

    let updated_values = {}

    const user = await db_connection.user_teacher_model.findOne({ where: { teacher_id: teacher_id } });

    if (!user) {
        return next(new ErrorResponse(`Trying to update invalid teacher`, 200));
    }

    if (!first_name || !last_name || !email || !roles) {
        return next(new ErrorResponse(`Required fields are missing`, 200));
    }

    updated_values.first_name = first_name;
    updated_values.last_name = last_name;
    updated_values.email = email;
    updated_values.roles = JSON.stringify(roles);
    updated_values.password = user.password;
    updated_values.academy_id = user.academy_id;

    if (password) {
        password = await hashed_password(password);
        updated_values.password = password;
    }

    const staff = await db_connection.user_teacher_model.update(
        { ...updated_values },
        { where: { teacher_id: teacher_id } }
    );
    if (!staff[0]) {
        return next(new ErrorResponse('Unable to update teacher', 200))
    }

    res.status(200).json({ success: true, data: {} });

});