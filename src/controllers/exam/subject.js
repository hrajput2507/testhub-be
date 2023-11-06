import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js';
import ErrorResponse from '../../utils/error.util.js';
import _response from '../../utils/response.util.js';

export const exam_subjects = async_handler(async (req, res, next, json = false) => {

    const subjects = await db_connection.subjects_model.findAll({});

    if (!subjects) {
        return next(new ErrorResponse('Unable to fetch exam subjects', 200))
    }

    return _response(res, 200, true, 'Subjects have been fetched', subjects, json);
})

export const add_exam_subject = async_handler(async (req, res, next) => {

    const subject = await db_connection.subjects_model.create(req.body);
    if (!subject) {
        return next(new ErrorResponse('Unable to create subject', 200))
    }
    res.status(200).json({ success: true, data: subject });
})

export const exam_subject = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})

export const update_exam_subject = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const updated_subject = await db_connection.subjects_model.update(
        { ...req.body },
        { where: { subject_id: id } }
    );

    if (!updated_subject[0]) {
        return next(new ErrorResponse('Unable to update', 200))
    }
    res.status(200).json({ success: true, data: {} });
})

export const delete_exam_subject = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})