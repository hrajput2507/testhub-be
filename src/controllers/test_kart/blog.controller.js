import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const get_published_blogs = async_handler(
  async (req, res, next, json = false) => {
    let sql = `SELECT b.*,bt.topic,bc.category from blog AS b LEFT JOIN blog_category AS bc ON bc.blog_category_id = b.blog_category_id LEFT JOIN blog_topic AS bt ON bt.blog_topic_id = b.blog_topic_id WHERE  b.is_deleted = 0 AND b.status = 1`;

    const blogs = await db_connection.sequelize.query(sql, {
      type: db_connection.sequelize.QueryTypes.SELECT,
    });

    if (!blogs) {
      return next(new ErrorResponse("Unable to fetch blogs", 200));
    }
    return _response(res, 200, true, "Blogs fetched", blogs, json);
  }
);

export const get_single_blog = async_handler(
  async (req, res, next, json = false) => {
    const slug = req.params.slug;
    let result = {};

    let sql = `SELECT b.* from blog AS b WHERE b.is_deleted = 0 AND b.slug = '${slug}'`;

    const blog = await db_connection.sequelize.query(sql, {
      type: db_connection.sequelize.QueryTypes.SELECT,
    });

    if (!blog) {
      return next(new ErrorResponse("Unable to fetch blog", 200));
    }

    if (blog[0].blog_id) {
      result = { ...blog[0] };
      result.content = JSON.parse(result.content);
      result.meta_keywords = JSON.parse(result.meta_keywords);
    } else {
      result = { ...blog[0] };
    }
    return _response(res, 200, true, "Blogs fetched", result, json);
  }
);
