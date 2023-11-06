import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js';
import ErrorResponse from '../../utils/error.util.js';

export const blog_topics = async_handler(async (req, res, next) => {

    let sql = `SELECT bt.*,bc.category  FROM blog_topic AS bt LEFT JOIN blog_category AS bc ON bc.blog_category_id = bt.blog_category_id `;

    const blog_topics = await db_connection.sequelize.query(sql, { type: db_connection.sequelize.QueryTypes.SELECT });

    if (!blog_topics) {
        return next(new ErrorResponse('Unable to fetch blog topics', 200))
    }
    res.status(200).json({ success: true, data: blog_topics });
})

export const add_blog_topic = async_handler(async (req, res, next) => {
    const blog_topic = await db_connection.blog_topic_model.create(req.body);
    if (!blog_topic) {
        return next(new ErrorResponse('Unable to create blog topic', 200))
    }
    res.status(200).json({ success: true, data: blog_topic });
})

export const blog_topic = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})
export const update_blog_topic = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const updated_blog_topic = await db_connection.blog_topic_model.update(
        { ...req.body },
        { where: { blog_topic_id: id } }
    );

    if (!updated_blog_topic[0]) {
        return next(new ErrorResponse('Unable to update', 200))
    }
    res.status(200).json({ success: true, data: {} });
})
export const delete_blog_topic = async_handler(async (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ success: true });
})