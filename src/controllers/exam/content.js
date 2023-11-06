import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";

export const exam_contents = async_handler(async (req, res, next) => {
  let sql = `SELECT ec.status, e.exam_id,e.exam ,e.slug ,e.status  as exam_status,c.category  FROM exam AS e LEFT JOIN exam_category AS c ON c.exam_category_id = e.category LEFT JOIN exam_content as ec ON ec.exam_id = e.exam_id `;

  const exams = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!exams) {
    return next(new ErrorResponse("Unable to fetch exam contents", 200));
  }
  res.status(200).json({ success: true, data: exams });
});

export const exam_content = async_handler(async (req, res, next) => {
  const id = req.params.id;
  let result = {};

  let sql = `SELECT ec.*, e.exam_id,e.exam FROM exam AS e LEFT JOIN exam_content as ec ON ec.exam_id = e.exam_id WHERE e.exam_id = ${id}`;

  const exams = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  let user_sql = `SELECT staff_id, CONCAT(first_name,' ',last_name) as author FROM user_staff`;

  const authors = await db_connection.sequelize.query(user_sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (exams[0].exam_content_id) {
    result = { ...exams[0] };
    result.sections = JSON.parse(result.sections);
    result.faqs = result.faqs ? JSON.parse(result.faqs) : [];
    result.meta_keywords = JSON.parse(result.meta_keywords);
  } else {
    const content = {};
    content.exam_id = id;
    content.meta_keywords = JSON.stringify([]);
    content.sections = JSON.stringify([]);
    content.faqs = JSON.stringify([]);

    const exam_content = await db_connection.exam_content_model.create(content);

    if (!exam_content) {
      return next(new ErrorResponse("Unable pre create exam content", 200));
    }

    result = {
      ...exams[0],
      ...exam_content.dataValues,
    };
    result.sections = JSON.parse(result.sections);
    result.faqs = result.faqs ? JSON.parse(result.faqs) : [];
    result.meta_keywords = JSON.parse(result.meta_keywords);
  }

  if (!exams) {
    return next(new ErrorResponse("Unable to fetch exam content", 200));
  }
  res
    .status(200)
    .json({ success: true, data: { exam_content: result, authors } });
});

export const save_exam_content = async_handler(async (req, res, next) => {
  const exam_content_id = req.body.exam_content_id;
  let exam_content;
  const content = {};

  content.exam_id = req.body.exam_id;
  content.logo = req.body.logo;
  content.meta_description = req.body.meta_description;
  content.meta_title = req.body.meta_title;
  content.meta_keywords = JSON.stringify(req.body.meta_keywords);
  content.popular_testseries = req.body.popular_testseries;
  content.sections = JSON.stringify(req.body.sections);
  content.faqs = JSON.stringify(req.body.faqs);
  content.short_description = req.body.short_description;
  content.status = req.body.status;

  if (exam_content_id) {
    exam_content = await db_connection.exam_content_model.update(
      { ...content },
      { where: { exam_content_id: exam_content_id } }
    );

    if (!exam_content[0]) {
      return next(new ErrorResponse("Unable to update", 200));
    }
  } else {
    exam_content = await db_connection.exam_content_model.create(content);
    if (!exam_content) {
      return next(new ErrorResponse("Unable to save content", 200));
    }
  }

  res.status(200).json({ success: true, data: exam_content });
});
