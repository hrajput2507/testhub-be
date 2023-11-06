import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import ErrorResponse from '../../utils/error.util.js';
import { hashed_password } from '../../utils/auth.util.js';

/**
 * Get all academies
 */
export const academies = async_handler(async (req, res, next) => {

    let sql = `SELECT ac.academy_id,ac.academy_name,ac.display_name,ac.slug,ac.contact_email,ac.website,ac.contact_phone,ac.about FROM academy AS ac `;

    const academies = await db_connection.sequelize.query(sql, { type: db_connection.sequelize.QueryTypes.SELECT });

    if (!academies) {
        return next(new ErrorResponse(`Unable to fetch academies`, 200));
    }

    res.status(200).json({ success: true, data: academies });

});

/**
 * Get single academy
 */
export const academy = async_handler(async (req, res, next) => {

    const academy_id = req.params.id;

    const academy = await db_connection.academy_model.findOne({ where: { academy_id } })

    if (!academy) {
        return next(new ErrorResponse(`Unable to fetch academy`, 200));
    }

    res.status(200).json({ success: true, data: academy });

});

/**
 * Add new academy
 */
export const add_academy = async_handler(async (req, res, next) => {

    const { academy_name, display_name, slug, logo, contact_email, website, contact_phone, about } = req.body;

    const { first_name, last_name, email } = req.body;
    let { password } = req.body;
    let roles = JSON.stringify(['ADMIN']);

    if (!first_name || !last_name || !email || !academy_name || !display_name || !slug) {
        return next(new ErrorResponse(`Required fields are missing`, 200));
    }
    if (!password) {
        return next(new ErrorResponse(`Password is missing`, 200));
    }

    password = await hashed_password(password);


    const academy = await db_connection.academy_model.create({ academy_name, display_name, slug, logo, contact_email, contact_phone, website, about });

    if (!academy) {
        return next(new ErrorResponse(`Error while creating academy`, 200));
    }

    const teacher = await db_connection.user_teacher_model.create({ first_name, last_name, email, password, roles, academy_id: academy.academy_id });

    if (!teacher) {
        await db_connection.academy_model.destroy({ where: { academy_id } })
        return next(new ErrorResponse(`Error while creating academy`, 200));
    }

    res.status(200).json({ success: true, data: { academy, teacher } });

});

/**
 * Update an academy
 */
export const update_academy = async_handler(async (req, res, next) => {

    const academy_id = req.params.id;
    const payload = req.body;

    const academy = await db_connection.academy_model.findOne({ where: { academy_id: academy_id } });

    if (!academy) {
        return next(new ErrorResponse(`Trying to update invalid academy`, 200));
    }

    const update_academy = await db_connection.academy_model.update(
        { ...payload },
        { where: { academy_id: academy_id } }
    );
    if (!update_academy[0]) {
        return next(new ErrorResponse('Unable to update academy', 200))
    }

    res.status(200).json({ success: true, data: {} });

});