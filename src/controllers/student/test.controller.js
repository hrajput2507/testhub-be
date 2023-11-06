import { Op } from "sequelize";
import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const create_test_session = async_handler(async (req, res, next) => {
  let { student_id } = req.user;
  let test_id = req.params.test_id;

  // console.log(req.headers.host.includes("localhost"));
  // console.log(req.headers.authorization.split(" ")[1]);

  let session_id;
  let message = "Test session found";

  const test_data = await db_connection.test_model.findOne({
    where: { test_id },
  });

  if (!test_data) {
    return next(new ErrorResponse("Invalid test ID", 200));
  }

  const existing_test_session = await db_connection.student_tests_model.findAll(
    {
      where: {
        student_id,
        test_id,
        is_completed: 0,
      },
    }
  );
  if (existing_test_session && existing_test_session.length > 0) {
    session_id = existing_test_session[0].dataValues.test_session_id;
  } else {
    const test_session = await db_connection.student_tests_model.create({
      student_id,
      test_id: test_data.dataValues.test_id,
      test_series_id: test_data.dataValues.test_series_id,
    });
    session_id = test_session.dataValues.test_session_id;
    message = "Test session created";
  }

  const portal_url = `${
    req.headers.host.includes("localhost")
      ? "http://localhost:4100"
      : "https://portal.testkart.in"
  }/?test_session_id=${session_id}&session_token=${
    req.headers.authorization.split(" ")[1]
  }`;
  return _response(res, 200, true, message, portal_url);
});

export const validate_test_session = async_handler(async (req, res, next) => {
  const { student_id } = req.user;
  const test_session_id = req.params.test_session_id;

  const test_session = await db_connection.student_tests_model.findOne({
    where: {
      test_session_id,
      student_id,
      is_completed: 0,
    },
  });

  if (!test_session) {
    return next(new ErrorResponse("Invalid test session", 200));
  }

  db_connection.student_tests_model.hasOne(db_connection.test_model, {
    sourceKey: "test_id",
    foreignKey: "test_id",
  });
  db_connection.student_tests_model.hasOne(db_connection.test_series_model, {
    sourceKey: "test_series_id",
    foreignKey: "test_series_id",
  });
  db_connection.test_series_model.hasOne(db_connection.exams_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });

  const test_session_data = await db_connection.student_tests_model.findOne({
    include: [
      {
        model: db_connection.test_model,
      },
      {
        model: db_connection.test_series_model,
        include: [
          {
            model: db_connection.exams_model,
          },
        ],
      },
    ],
    where: {
      test_session_id,
      student_id,
      is_completed: 0,
    },
  });

  return _response(res, 200, true, "Test session found", test_session_data);
});

export const start_test = async_handler(async (req, res, next) => {
  const { student_id } = req.user;
  const test_session_id = req.params.test_session_id;

  const test_session = await db_connection.student_tests_model.findOne({
    where: {
      test_session_id,
      student_id,
      is_completed: 0,
    },
  });

  if (!test_session) {
    return next(new ErrorResponse("Invalid test session", 200));
  }

  const questions = await db_connection.question_model.findAll({
    where: {
      test_id: test_session.dataValues.test_id,
    },
  });

  if (!questions) {
    return next(new ErrorResponse("The test is not ready with questions", 200));
  }

  return _response(res, 200, true, "Questions fetched sucessfully", {
    questions,
  });
});

export const update_test_session = async_handler(async (req, res, next) => {
  const { student_id } = req.user;
  const test_session_id = req.params.test_session_id;

  const test_session = await db_connection.student_tests_model.findOne({
    where: {
      test_session_id,
      student_id,
      is_completed: 0,
    },
  });

  if (!test_session) {
    return next(new ErrorResponse("Invalid test session", 200));
  }

  const updated_session = await db_connection.student_tests_model.update(
    {
      response: JSON.stringify(req.body.response),
      session_time: req.body.session_time,
    },
    {
      where: {
        test_session_id,
        student_id,
        is_completed: 0,
      },
    }
  );

  if (!updated_session[0]) {
    console.log("not updated");
    return next(new ErrorResponse("Unable to update test session", 200));
  }

  return _response(res, 200, true, "Test session updated", {});
});

export const submit_test = async_handler(async (req, res, next) => {
  const { student_id } = req.user;
  const test_session_id = req.params.test_session_id;

  const test_session = await db_connection.student_tests_model.findOne({
    where: {
      test_session_id,
      student_id,
      is_completed: 0,
    },
  });

  if (!test_session) {
    return next(new ErrorResponse("Invalid test session", 200));
  }

  let session_payload = {
    response: JSON.stringify(req.body.response),
    session_time: req.body.session_time,
  };

  session_payload.is_submitted = req.body.is_submitted
    ? req.body.is_submitted
    : 0;
  session_payload.is_completed = req.body.is_completed
    ? req.body.is_completed
    : 0;

  const updated_session = await db_connection.student_tests_model.update(
    {
      ...session_payload,
    },
    {
      where: {
        test_session_id,
        student_id,
        is_completed: 0,
      },
    }
  );

  if (!updated_session[0]) {
    console.log("not updated");
    return next(new ErrorResponse("Unable to submit test responses", 200));
  }

  return _response(
    res,
    200,
    true,
    "Your test responses have been submited",
    {}
  );
});

export const start_demo_test = async_handler(async (req, res, next) => {
  const test_id = req.params.test_id;

  const test = await db_connection.test_model.findOne({
    where: { test_id },
  });

  if (!test) {
    return next(new ErrorResponse("The test is not ready", 200));
  }

  db_connection.test_series_model.hasOne(db_connection.exams_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });
  db_connection.test_series_model.hasOne(db_connection.academy_model, {
    sourceKey: "academy_id",
    foreignKey: "academy_id",
  });

  const test_series = await db_connection.test_series_model.findOne({
    where: { test_series_id: test.dataValues.test_series_id, status: 1 },
    include: [
      {
        model: db_connection.academy_model,
        attributes: ["display_name", "logo"],
      },
      {
        model: db_connection.exams_model,
      },
    ],
  });

  if (!test_series) {
    return next(new ErrorResponse("The test is not ready", 200));
  }

  const questions = await db_connection.question_model.findAll({
    where: { test_id },
  });

  if (!questions) {
    return next(new ErrorResponse("The test is not ready with questions", 200));
  }

  const deafult_pattern = JSON.parse(
    test_series.dataValues.exam.default_pattern
  );
  const test_pattern = JSON.parse(test.subjects);

  let meta_data = {};
  meta_data.duration = +test.dataValues.duration;
  meta_data.questions = questions.length;
  meta_data.positive_marks = +deafult_pattern.positive_marks;
  meta_data.negative_marks = +deafult_pattern.negative_marks;
  meta_data.marks = 0;

  test_pattern.map((subject) => {
    if (subject.inclued) {
      deafult_pattern.subjects.map((pattern) => {
        if (subject.subject_id === pattern.subject) {
          meta_data.marks =
            meta_data.marks +
            +subject.total_questions * +deafult_pattern.positive_marks;
        }
      });
    }
  });

  return _response(res, 200, true, "Test data fetched sucessfully", {
    questions,
    test,
    test_series,
    meta_data,
  });
});
