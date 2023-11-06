import { Op } from "sequelize";
import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const student_test_series = async_handler(async (req, res, next) => {
  let { exams } = req.student_preferences;
  exams = JSON.parse(JSON.parse(exams));

  const test_series = await db_connection.test_series_model.findAll({
    where: {
      exam_id: {
        [Op.in]: exams,
      },
    },
  });

  return _response(res, 200, true, "Test series found", test_series);
});
