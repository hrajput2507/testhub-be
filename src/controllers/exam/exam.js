import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";

export const exams = async_handler(async (req, res, next) => {
  let sql = `SELECT e.*,c.category  FROM exam AS e LEFT JOIN exam_category AS c ON c.exam_category_id = e.category `;

  let exams = await db_connection.sequelize.query(sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!exams) {
    return next(new ErrorResponse("Unable to fetch exams", 200));
  }

  exams.forEach((exam) => {
    if (exam.default_pattern) {
      exam.default_pattern = JSON.parse(exam.default_pattern);
    } else {
      exam.default_pattern = "";
    }
  });

  res.status(200).json({ success: true, data: exams });
});

export const add_exam = async_handler(async (req, res, next) => {
  if (req.body.initials) {
    const categories = await db_connection.exam_category_model.findAll({});
    if (!categories) {
      return next(new ErrorResponse("Unable to fetch exam categories", 200));
    }
    const subjects = await db_connection.subjects_model.findAll({});
    if (!subjects) {
      return next(new ErrorResponse("Unable to fetch exam subjects", 200));
    }

    return res
      .status(200)
      .json({ success: true, data: { categories, subjects } });
  }

  let payload = req.body;
  payload.default_pattern = JSON.stringify(payload.default_pattern);

  const exam = await db_connection.exams_model.create(payload);
  if (!exam) {
    return next(new ErrorResponse("Unable to create exam exam", 200));
  }
  return res.status(200).json({ success: true, data: exam });
});

export const exam = async_handler(async (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({ success: true });
});
export const update_exam = async_handler(async (req, res, next) => {
  const id = req.params.id;
  let payload = req.body;
  payload.default_pattern = JSON.stringify(payload.default_pattern);

  const updated_category = await db_connection.exams_model.update(
    { ...payload },
    { where: { exam_id: id } }
  );

  if (!updated_category[0]) {
    return next(new ErrorResponse("Unable to update", 200));
  }
  res.status(200).json({ success: true, data: {} });
});
export const delete_exam = async_handler(async (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({ success: true });
});

export const parsed_exams = async_handler(async (req, res, next) => {
  let parsed_exams = [];

  let exam_sql = `SELECT e.*,c.category  FROM exam AS e LEFT JOIN exam_category AS c ON c.exam_category_id = e.category `;

  let exams = await db_connection.sequelize.query(exam_sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!exams) {
    return next(new ErrorResponse("Unable to fetch exams", 200));
  }
  let subject_sql = `SELECT s.subject_id, s.subject FROM exam_subject AS s `;
  let subjects = await db_connection.sequelize.query(subject_sql, {
    type: db_connection.sequelize.QueryTypes.SELECT,
  });

  if (!subjects) {
    return next(new ErrorResponse("Unable to fetch subjects", 200));
  }

  exams.forEach((exam) => {
    if (exam.default_pattern) {
      exam.default_pattern = JSON.parse(exam.default_pattern);
      let parsed_subjects = [];
      exam.default_pattern.subjects.forEach((subject_id) => {
        subjects.forEach((subject) => {
          if (subject_id.subject === subject.subject_id) {
            parsed_subjects.push(subject);
          }
        });
      });
      exam.default_pattern.subjects = parsed_subjects;
      parsed_exams.push(exam);
    }
  });

  res.status(200).json({ success: true, data: parsed_exams });
});
