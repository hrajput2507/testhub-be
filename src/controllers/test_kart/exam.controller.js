import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const exams_grouped_by_category = async_handler(
  async (req, res, next, json = false) => {
    /* Associating blog category and balog topic */
    db_connection.exam_category_model.hasMany(db_connection.exams_model, {
      sourceKey: "exam_category_id",
      foreignKey: "category",
    });
    db_connection.exams_model.hasOne(db_connection.exam_content_model, {
      sourceKey: "exam_id",
      foreignKey: "exam_id",
    });

    const exams = await db_connection.exam_category_model.findAll({
      attributes: ["category", "slug", "description"],
      include: {
        model: db_connection.exams_model,
        attributes: ["exam", "slug"],
        include: {
          model: db_connection.exam_content_model,
          attributes: ["logo"],
        },
      },
    });

    return _response(
      res,
      200,
      true,
      "Exams found by category sucessfully",
      exams,
      json
    );
  }
);

export const exam_details = async_handler(async (req, res, next) => {
  const slug = req.params.slug;
  let result = {};

  let sql = `SELECT ec.*,CONCAT(a.first_name,' ',a.last_name) as author,a.avatar,a.designation,a.bio,e.exam,ecy.exam_category_id,ecy.slug as category_slug FROM exam AS e LEFT JOIN exam_content as ec ON ec.exam_id = e.exam_id LEFT JOIN exam_category as ecy ON e.category = ecy.exam_category_id LEFT JOIN user_staff as a ON a.staff_id = ec.user_id WHERE e.slug = '${slug}' `;

  const exams = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (exams && exams[0] && exams[0].exam_content_id) {
    result = { ...exams[0] };
    // console.log(req.query.preview_token);
    if (req.query.preview_token) {
      result.sections = JSON.parse(result.sections);
      result.faqs = result.faqs ? JSON.parse(result.faqs) : [];
    } else if (result.status != 1) {
      result.sections = [];
      result.faqs = [];
    } else {
      result.sections = JSON.parse(result.sections);
      console.log('faqs', result.faqs);
      result.faqs = result.faqs ? JSON.parse(result.faqs) : [];
    }

    result.meta_keywords = JSON.parse(result.meta_keywords);
  } else {
    result = { ...exams[0] };
  }

  const exam_id = result.exam_id;
  const exam_category_id = result.exam_category_id;
  let related_exams_sql = `SELECT e.*  FROM exam AS e WHERE e.category = '${exam_category_id}' AND e.exam_id !=  '${exam_id}'`;
  const related_exams = await db_connection.sequelize.query(related_exams_sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (related_exams) {
    result.related_exams = related_exams;
  }

  if (!exams) {
    return next(new ErrorResponse("Unable to fetch exam content", 200));
  }
  res.status(200).json({ success: true, data: result });
});

export const academy_details = async_handler(
  async (req, res, next, json = false) => {
    const slug = req.params.slug;
    const details = await db_connection.academy_model.findAll({
      where: { slug },
    });

    return _response(
      res,
      200,
      true,
      "Teachers details found sucessfully",
      details,
      json
    );
  }
);
