import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const popular_test_series = async_handler(
  async (req, res, next, json = false) => {
    db_connection.test_series_model.hasOne(db_connection.exams_model, {
      sourceKey: "exam_id",
      foreignKey: "exam_id",
    });
    db_connection.test_series_model.hasOne(db_connection.academy_model, {
      sourceKey: "academy_id",
      foreignKey: "academy_id",
    });

    const test_series = await db_connection.test_series_model.findAll({
      where: {
        status: 1,
      },
      include: [
        {
          model: db_connection.academy_model,
          attributes: ["display_name", "slug"],
        },
        {
          model: db_connection.exams_model,
          attributes: ["exam", "slug"],
        },
      ],
    });

    return _response(
      res,
      200,
      true,
      "Populat test-series found by category sucessfully",
      test_series,
      json
    );
  }
);

export const list_test_series = async_handler(async (req, res, next) => {
  db_connection.exams_model.hasMany(db_connection.test_series_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });
  db_connection.test_series_model.hasOne(db_connection.academy_model, {
    sourceKey: "academy_id",
    foreignKey: "academy_id",
  });

  const test_series = await db_connection.exams_model.findAll({
    attributes: ["exam", "slug"],
    include: {
      model: db_connection.test_series_model,
      where: { status: 1 },
      include: [
        {
          model: db_connection.academy_model,
          attributes: ["display_name", "slug"],
        },
      ],
    },
  });

  db_connection.exams_model.hasOne(db_connection.exam_content_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });
  const popular_exams = await db_connection.exams_model.findAll({
    where: { status: 1 },
    include: {
      model: db_connection.exam_content_model,
      attributes: ["logo"],
    },
  });

  const faqs = [
    {
      question: "What is the validity of a test series?",
      answer:
        "Validity of a test series varies from one test series creator to another. You can see validity of each and every test series on the detail page of test series.",
    },
    {
      question:
        "How TestKart ensures quality and accuracy of questions asked in any test series?",
      answer:
        "We ask students for rating and feedback regarding quality and accuracy of questions after every time they attempt any mock test of any test series. Feedback and ratings help us and others students to create a perspective about any particular test series. If any test series do not maintain quality and certain parameter then that test series will be removed from TestKart.",
    },
    {
      question: "Where will students attempt these test series?",
      answer:
        "Students will attempt test series on TestKart portal itself, TestKart's exam portal is similar to any real exam dashboard provided in any government or competitive examinations.",
    },
    {
      question: "Can test series available on TestKart be downloaded?",
      answer:
        "No, TestKart doesn't allow any students to download test series in pdf or any other forms. Students have to attempt these test series on TestKart portal only.",
    },
    {
      question: "Test series available on TestKart are free or paid?",
      answer:
        "A test series contains a set of tests, in which first few tests are made available to attempt freely by any students. However, to access the full test series, students have to buy that test series. (Availability of free test in any test series depends upon the creators choice).",
    },
  ];

  return _response(
    res,
    200,
    true,
    "All test-series found by category sucessfully",
    { test_series, faqs, popular_exams }
  );
});

export const list_tests = async_handler(async (req, res, next) => {
  const hash = req.params.hash;

  db_connection.test_series_model.hasOne(db_connection.exams_model, {
    sourceKey: "exam_id",
    foreignKey: "exam_id",
  });
  db_connection.test_series_model.hasOne(db_connection.academy_model, {
    sourceKey: "academy_id",
    foreignKey: "academy_id",
  });

  const test_series = await db_connection.test_series_model.findOne({
    where: {
      status: 1,
      hash,
    },
    include: [
      {
        model: db_connection.academy_model,
      },
      {
        model: db_connection.exams_model,
        attributes: ["exam", "slug"],
      },
    ],
  });

  if (!test_series) {
    return next(new ErrorResponse("Unable to list test series", 200));
  }

  const test_series_id = test_series.dataValues.test_series_id;

  const tests = await db_connection.test_model.findAll({
    where: {
      test_series_id,
    },
  });

  const faqs = [
    {
      question: "What is the validity of a test series?",
      answer:
        "Validity of a test series varies from one test series creator to another. You can see validity of each and every test series on the detail page of test series.",
    },
    {
      question:
        "How TestKart ensures quality and accuracy of questions asked in any test series?",
      answer:
        "We ask students for rating and feedback regarding quality and accuracy of questions after every time they attempt any mock test of any test series. Feedback and ratings help us and others students to create a perspective about any particular test series. If any test series do not maintain quality and certain parameter then that test series will be removed from TestKart.",
    },
    {
      question: "Where will students attempt these test series?",
      answer:
        "Students will attempt test series on TestKart portal itself, TestKart's exam portal is similar to any real exam dashboard provided in any government or competitive examinations.",
    },
    {
      question: "Can test series available on TestKart be downloaded?",
      answer:
        "No, TestKart doesn't allow any students to download test series in pdf or any other forms. Students have to attempt these test series on TestKart portal only.",
    },
    {
      question: "Test series available on TestKart are free or paid?",
      answer:
        "A test series contains a set of tests, in which first few tests are made available to attempt freely by any students. However, to access the full test series, students have to buy that test series. (Availability of free test in any test series depends upon the creators choice).",
    },
  ];

  return _response(
    res,
    200,
    true,
    "Popular test-series found by category sucessfully",
    { test_series, tests, faqs }
  );
});
