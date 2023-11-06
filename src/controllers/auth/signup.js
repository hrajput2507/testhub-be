import user_type from '../../../config/user_type.js';
import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import { hashed_password } from '../../utils/auth.util.js';
import ErrorResponse from '../../utils/error.util.js';

export const signup = async_handler(async (req, res, next) => {

    const { type } = req.body;

    if (!type) {
        return next(new ErrorResponse(`Type is missing`, 200));
    }

    if (type == user_type.staff) {
        return staff_signup(req, res, next);
    }

    return next(new ErrorResponse(`Acceptable type: ${user_type.staff} | ${user_type.teacher} | ${user_type.student}`, 200));

});

const staff_signup = async_handler(async (req, res, next) => {

    const { first_name, last_name, email } = req.body;
    let { password } = req.body;

    password = await hashed_password(password);
    const staff = await db_connection.user_staff_model.create({ first_name, last_name, email, password });

    res.status(200).json({ success: true, staff });

});