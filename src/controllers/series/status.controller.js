import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";
import { upload_file } from "../files/file.js";

/* 
    Middleware to verfiy if the test series is ready to publish or not
*/
export const verify_publish = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const test_series = await db_connection.test_series_model.findAll({
    where: { test_series_id: id },
  });
  if (!test_series) {
    return next(new ErrorResponse("Invalid test series", 200));
  }
  /* Associating test and question */
  db_connection.test_model.hasMany(db_connection.question_model, {
    sourceKey: "test_id",
    foreignKey: "test_id",
  });
  const tests = await db_connection.test_model.findAll({
    include: [
      {
        model: db_connection.question_model,
        attributes: ["question_id"],
      },
    ],
    where: { test_series_id: id },
  });
  for (const test of tests) {
    let total_questions = 0;
    JSON.parse(test.subjects).forEach((subject) => {
      if (subject.inclued) {
        total_questions = total_questions + subject.total_questions;
      }
    });
    if (test.questions.length < total_questions) {
      return next(
        new ErrorResponse("Test series is not ready for publish", 200)
      );
    }
  }
  next();
});

export const publish_status = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const test_series = await db_connection.test_series_model.findAll({
    where: { test_series_id: id },
  });
  return _response(
    res,
    200,
    true,
    "Test series is verrifed and ready to publish",
    { test_series }
  );
});

export const publish = async_handler(async (req, res, next) => {
  const id = req.params.id;

  if (!req.body.free_tests) {
    return next(new ErrorResponse("Free Tests are required", 200));
  }

  const test_series = await db_connection.test_series_model.findAll({
    where: { test_series_id: id },
  });
  if (!test_series) {
    return next(new ErrorResponse("Invalid test series", 200));
  }

  const updated = await db_connection.test_series_model.update(
    { ...req.body, status: 1 },
    { where: { test_series_id: id } }
  );

  if (!updated[0]) {
    return next(new ErrorResponse("Unable to publish", 200));
  }

  if (req.files) {
    req.body.entity = "test_series_id";
    req.body.entity_id = id;
    req.body.column_name = "cover_photo";
    req.body.table = "test_series";
    // entity, entity_id, column_name, table
    await upload_file(req, res, next, true);
  }

  const updated_test_series = await db_connection.test_series_model.findAll({
    where: { test_series_id: id },
  });

  return _response(
    res,
    200,
    true,
    "Test series is published",
    updated_test_series[0]
  );
});

export const unlist = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const updated = await db_connection.test_series_model.update(
    { status: 2 },
    { where: { test_series_id: id } }
  );

  if (!updated[0]) {
    return next(new ErrorResponse("Unable to unlist the test series", 200));
  }
  return _response(res, 200, true, "Test series is unlisted", {});
});

export const list = async_handler(async (req, res, next) => {
  const id = req.params.id;

  const test_series = await db_connection.test_series_model.findAll({
    where: { test_series_id: id },
  });
  if (!test_series) {
    return next(new ErrorResponse("Invalid test series", 200));
  }
  if (+test_series[0].dataValues.status !== 2) {
    return next(new ErrorResponse("Invalid operation", 200));
  }

  const updated = await db_connection.test_series_model.update(
    { status: 1 },
    { where: { test_series_id: id } }
  );

  if (!updated[0]) {
    return next(new ErrorResponse("Unable to list the test series", 200));
  }
  return _response(res, 200, true, "Test series is listed on TestKart", {});
});
