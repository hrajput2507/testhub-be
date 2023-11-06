import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";
import { exam_subjects } from "../exam/subject.js";

export const all_test_series = async_handler(async (req, res, next) => {
  const { academy_id } = req.user;
  const test_series = await db_connection.test_series_model.findAll({
    where: {
      academy_id,
    },
  });
  if (!test_series) {
    return next(new ErrorResponse("Unable to fetch test series", 200));
  }
  res.status(200).json({ success: true, data: test_series });
});

export const add_test_series = async_handler(async (req, res, next) => {
  const test_series = await db_connection.test_series_model.create(req.body);

  if (!test_series) {
    return next(new ErrorResponse("Unable to create test series", 200));
  }
  res.status(200).json({ success: true, data: test_series });
});

export const test_series = async_handler(async (req, res, next) => {
  const id = req.params.id;

  const subjects = await exam_subjects(req, res, next, true);

  /* Associating blog category and balog topic */
  db_connection.test_series_model.hasOne(db_connection.exams_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });

  const test_series = await db_connection.test_series_model.findAll({
    include: {
      model: db_connection.exams_model,
    },
    where: {
      test_series_id: id,
    },
  });

  if (!test_series) {
    return next(
      new ErrorResponse(`Unable to fetch test series with id - ${id}`, 200)
    );
  }

  let parsed_data = test_series[0];
  parsed_data.exam.default_pattern = JSON.parse(
    parsed_data.exam.default_pattern
  );

  parsed_data.exam.default_pattern.subjects.forEach((subject, index) => {
    subjects.forEach((value) => {
      if (subject.subject === value.subject_id) {
        parsed_data.exam.default_pattern.subjects[index] = {
          subject_id: value.subject_id,
          subject: value.subject,
          questions: subject.questions,
        };
      }
    });
  });

  return _response(res, 200, true, "Test series details", parsed_data);
});

export const update_test_series = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const updated_category = await db_connection.test_series_model.update(
    { ...req.body },
    { where: { test_series_id: id } }
  );

  if (!updated_category[0]) {
    return next(new ErrorResponse("Unable to update", 200));
  }
  return _response(res, 200, true, "Test series updated", {});
});

export const delete_test_series = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const test_series = await db_connection.test_series_model.findAll({
    where: {
      test_series_id: id,
    },
  });

  if (!test_series) {
    return next(new ErrorResponse(`Invalid test series - ${id}`, 200));
  }

  const tests = await db_connection.test_model.findAll({
    where: {
      test_series_id: id,
    },
  });

  if (tests.length === 0) {
    const delete_series = await db_connection.test_series_model.destroy({
      where: { test_series_id: id },
    });
    return _response(res, 200, true, "Test series deleted", {});
  } else {
    return next(
      new ErrorResponse(
        `Cannot delete this series as it have tests in it.`,
        200
      )
    );
  }
});
