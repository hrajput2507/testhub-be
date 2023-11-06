import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";

export const blogs_initials = async_handler(async (req, res, next) => {
  /* Associating blog category and balog topic */
  db_connection.blog_category_model.hasMany(db_connection.blog_topic_model, {
    sourceKey: "blog_category_id",
    foreignKey: "blog_category_id",
  });

  const data = await db_connection.blog_category_model.findAll({
    include: {
      model: db_connection.blog_topic_model,
    },
  });

  res.status(200).json({ success: true, data });
});

export const blogs = async_handler(async (req, res, next) => {
  let sql = `SELECT b.blog_id,b.title,b.status,bt.topic,bc.category from blog AS b LEFT JOIN blog_category AS bc ON bc.blog_category_id = b.blog_category_id LEFT JOIN blog_topic AS bt ON bt.blog_topic_id = b.blog_topic_id WHERE `;

  if (req.query?.filter == "deleted") {
    sql += ` b.is_deleted = 1 `;
  } else {
    sql += ` b.is_deleted = 0 `;
  }

  if (req.query?.filter == "draft") {
    sql += ` AND b.status = 0 `;
  }

  if (req.query?.filter == "published") {
    sql += ` AND b.status = 1 `;
  }

  const blogs = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!blogs) {
    return next(new ErrorResponse("Unable to fetch blogs", 200));
  }
  res.status(200).json({ success: true, data: blogs });
});

export const blog = async_handler(async (req, res, next) => {
  const id = req.params.id;
  let result = {};

  let sql = `SELECT b.* from blog AS b WHERE b.is_deleted = 0 AND b.blog_id = ${id}`;

  const blog = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (blog[0].blog_id) {
    result = { ...blog[0] };
    result.content = JSON.parse(result.content);
    result.meta_keywords = JSON.parse(result.meta_keywords);
  } else {
    result = { ...blog[0] };
  }

  if (!blog) {
    return next(new ErrorResponse("Unable to fetch blog", 200));
  }
  res.status(200).json({ success: true, data: result });
});

export const save_blog = async_handler(async (req, res, next) => {
  const blog_id = req.body.blog_id;
  let exam_content;
  const content = {};

  content.title = req.body.title;
  content.slug = req.body.slug;
  content.blog_category_id = req.body.blog_category_id;
  content.blog_topic_id = req.body.blog_topic_id;
  content.featured_image = req.body.featured_image;
  content.content = JSON.stringify(req.body.content);
  content.short_description = req.body.short_description;
  content.meta_description = req.body.meta_description;
  content.meta_title = req.body.meta_title;
  content.meta_keywords = JSON.stringify(req.body.meta_keywords);
  content.status = req.body.status;

  if (blog_id) {
    exam_content = await db_connection.blog_model.update(
      { ...content },
      { where: { blog_id: blog_id } }
    );

    if (!exam_content[0]) {
      return next(new ErrorResponse("Unable to update blog", 200));
    }
  } else {
    exam_content = await db_connection.blog_model.create(content);
    if (!exam_content) {
      return next(new ErrorResponse("Unable to create blog", 200));
    }
  }

  res.status(200).json({ success: true, data: exam_content });
});

export const delete_blog = async_handler(async (req, res, next) => {
  const blog_id = req.params.id;
  let exam_content;
  const content = {};

  content.is_deleted = 1;

  if (blog_id) {
    exam_content = await db_connection.blog_model.update(
      { ...content },
      { where: { blog_id: blog_id } }
    );

    if (!exam_content[0]) {
      return next(new ErrorResponse("Unable to delete blog", 200));
    }
  } else {
    return next(new ErrorResponse("Invalid blog id", 200));
  }

  res.status(200).json({ success: true, data: {} });
});
