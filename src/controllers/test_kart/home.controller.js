import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import _response from "../../utils/response.util.js";
import { exams_grouped_by_category } from "./exam.controller.js";
import { popular_test_series } from "./test-series.controller.js";

export const home_bundle = async_handler(async (req, res, next) => {
  /* Associating blog category and balog topic */
  db_connection.exam_category_model.hasMany(db_connection.exams_model, {
    sourceKey: "exam_category_id",
    foreignKey: "category",
  });

  const exams = await exams_grouped_by_category(req, res, next, true);
  const test_series = await popular_test_series(req, res, next, true);

  // const faqs = await db_connection.faq_model.findAll({ where: { location: 'HOME' } });

  /* Final bunddled data */
  const data = {
    exams,
    test_series
  };

  return _response(res, 200, true, "Home data", data);
});
