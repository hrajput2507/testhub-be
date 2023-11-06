import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js';
import ErrorResponse from '../../utils/error.util.js';

export const blog_categories = async_handler(async (req, res, next) => {

    const categories = await db_connection.blog_category_model.findAll({});
    if (!categories) {
        return next(new ErrorResponse('Unable to fetch blog categories', 200))
    }
    res.status(200).json({ success: true, data: categories });
})

export const add_blog_category = async_handler(async (req, res, next) => {

    const category = await db_connection.blog_category_model.create(req.body);
    if (!category) {
        return next(new ErrorResponse('Unable to create blog category', 200))
    }
    res.status(200).json({ success: true, data: category });
})

export const blog_category = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})

export const update_blog_category = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const updated_category = await db_connection.blog_category_model.update(
        { ...req.body },
        { where: { blog_category_id: id } }
    );

    if (!updated_category[0]) {
        return next(new ErrorResponse('Unable to update', 200))
    }
    res.status(200).json({ success: true, data: {} });
})

export const delete_blog_category = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})