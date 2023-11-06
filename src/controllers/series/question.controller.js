import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import cheerio from 'cheerio';
import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";
import { test } from './test.controller.js';

export const get_questions = async_handler(async (req, res, next) => {
  const test_id = req.query.test_id;
  const subject_id = req.query.subject_id;

  const questions = await db_connection.question_model.findAll({
    where: {
      test_id,
      subject_id,
    },
    attributes: ["question_id", "index"]
  });

  if (!questions) {
    return next(new ErrorResponse("Unable to get questions", 200));
  }

  return _response(res, 200, true, "Questions fetched sucessfully", {
    questions,
  });
});


export const get_question = async_handler(async (req, res, next) => {
  const question_id = req.params.id;

  const question = await db_connection.question_model.findByPk(question_id);

  if (!question) {
    return next(new ErrorResponse("Unable to get question", 200));
  }

  return _response(res, 200, true, "Question fetched sucessfully", {
    question,
  });
});

export const add_question = async_handler(async (req, res, next) => {
  let data = req.body;
  data.question = JSON.stringify(data.question);
  data.options = JSON.stringify(data.options);

  const question = await db_connection.question_model.create(data);

  if (!question) {
    return next(new ErrorResponse("Unable to add question", 200));
  }

  const test_id = req.body.test_id;
  const subject_id = req.body.subject_id;

  const questions = await db_connection.question_model.findAll({
    where: {
      test_id,
      subject_id,
    },
  });

  return _response(res, 200, true, "Question added sucessfully", { questions });
});

export const update_question = async_handler(async (req, res, next) => {
  const question_id = req.params.id;
  let data = req.body;
  data.question = JSON.stringify(data.question);
  data.options = JSON.stringify(data.options);

  const updated_category = await db_connection.question_model.update(
    { ...data },
    { where: { question_id: question_id } }
  );

  if (!updated_category[0]) {
    return next(new ErrorResponse("Unable to update", 200));
  }

  const test_id = req.body.test_id;
  const subject_id = req.body.subject_id;

  const questions = await db_connection.question_model.findAll({
    where: {
      test_id,
      subject_id,
    },
  });

  return _response(res, 200, true, "Question updated sucessfully", {
    questions,
  });
});

export const delete_question = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const question = await db_connection.question_model.findByPk(id);
  if (!question) {
    return _response(res, 200, true, `Question not find by id ${id}`);
  }
  const delete_question = await db_connection.question_model.destroy({
    where: { question_id: id },
  });
  const questions = await db_connection.question_model.findAll({
    where: {
      test_id: question.test_id,
      subject_id: question.subject_id,
    },
  });

  return _response(res, 200, true, "Question delete sucessfully", {
    questions,
  });
});

/**
 * Import question from doc in database
 */
export const import_questions = async_handler(async (req, res, next) => {

  const MARK_CLIP_TRUE = req.body.MARK_CLIP_TRUE || false;
  const MARK_PARTIAL_TRUE = req.body.MARK_PARTIAL_TRUE || false;
  const SAVE_TO_DB = req.body.SAVE_TO_DB || false;
  const { test_id } = req.params;
  const { subject_id } = req.query;

  console.log("MARK_PARTIAL_TRUE", MARK_PARTIAL_TRUE);
  console.log("SAVE_TO_DB", SAVE_TO_DB);

  if (!test_id || !subject_id) {
    return _response(res, 200, false, `Required parameters are missing`);
  }

  req.params.id = test_id;
  const test_raw = await test(req, res, next, true);
  const test_data = JSON.parse(JSON.stringify(test_raw[0]));

  const subject = test_data.subjects.find(subject => subject.subject_id === +subject_id);

  if (!subject) {
    return _response(res, 200, false, `Invalide subject`);
  }


  const file = req.files.file;
  const buffer = file.data;

  // Read the DOCX file into a bufferfrom local file for dev
  // const file = true;
  // const buffer = fs.readFileSync(path.resolve("src/controllers/series/documents/", "Questions_with_math_formula.docx"));

  if (file) {
    mammoth
      .convertToHtml({ buffer })
      .then(async (result) => {
        const html = result.value;

        // Write the generated HTML to a file
        // fs.writeFileSync('output.html', html);

        const $ = cheerio.load(html);
        const tables = $('table').toArray();

        const questions = [];
        let index = 0;
        const erros = [];
        for (const table of tables) {
          const rows = $(table).find('tr');
          let question = $(rows[0]).find('th').html();
          if (!question) {
            question = $(rows[0]).find('td').html();
          }

          let solution = $(rows[rows.length - 2]).find('th').html();
          if (!solution) {
            solution = $(rows[rows.length - 2]).find('td').html();
          }
          // const positiveMarks = parseInt($(rows.last()).find('th').eq(0).text());
          // const negativeMarks = parseInt($(rows.last()).find('th').eq(1).text());

          /**
           * Options parsing
           */
          const left = rows.slice(1, rows.length - 2);
          const options = [];
          let error_in_options = false;
          for (const row of left) {
            let option = $(row).find('th').eq(0);

            if (!$(row).find('th').html()) {
              option = $(row).find('td').eq(0);
            }
            const has_image = option.find('img').length > 0;
            let resolution = $(row).find('th').eq(1).text().trim().toLowerCase();
            if (!resolution) {
              resolution = $(row).find('td').eq(1).text().trim().toLowerCase();
            }
            if (!resolution || !option) {
              error_in_options = true;
            }

            const is_correct_option = resolution === 'correct';

            options.push({
              option: option.html()?.trim(),
              is_correct: is_correct_option,
            });
          }
          if (!question || options.length === 0 || error_in_options) {
            erros.push({
              index: index + 1,
              question: question === null ? 'Question is missing' : false,
              options: options.length === 0 ? 'Options are missing' : error_in_options ? 'Errors in options' : false
            })
          }
          questions.push({
            index,
            test_id,
            subject_id,
            question_type: "MCQ-S",
            question: JSON.stringify(question),
            options: JSON.stringify(options),
            solution: JSON.stringify(solution),
          });
          index++;
        }

        if (!MARK_PARTIAL_TRUE && subject.total_questions > questions.length) {
          return _response(res, 200, false, `The upload doc have ${questions.length} question but this subject must have ${subject.total_questions}.You can add rest manually later. Do you wanted to continue.`, { code: "MARK_PARTIAL_TRUE" });
        }

        // if (!MARK_CLIP_TRUE || subject.total_questions < questions.length) {
        //   return _response(res, 200, false, `The upload doc have ${questions.length} question but this subject must have ${subject.total_questions} , rest question will be dropped. Do you wanted to continue`, { code: "MARK_CLIP_TRUE" });
        // }

        if (subject.total_questions < questions.length) {
          return _response(res, 200, false, `The upload doc have ${questions.length} question but this subject must have ${subject.total_questions}.Please try again with proper question count.`, { code: "MISS_MATCH_COUNT" });
        }

        if (erros.length > 0) {
          return _response(res, 200, false, `There are few errors in the uploaded doc.`, { code: "MISSING_DATA", erros });
        }



        if (SAVE_TO_DB) {
          const question = await db_connection.question_model.bulkCreate(questions);

          questions.map((question) => {
            question.question = JSON.parse(question.question);
            question.solution = JSON.parse(question.solution);
            question.options = JSON.parse(question.options);

          });

          return _response(res, 201, true, "Saved to database", { code: "SAVED", questions: questions.slice(0, subject.total_questions) });
        }

        questions.map((question) => {
          question.question = JSON.parse(question.question);
          question.solution = JSON.parse(question.solution);
          question.options = JSON.parse(question.options);
        });

        return _response(res, 201, true, "Preview questions", { code: "PREVIEW_QUESTIONS", questions });
      })
      .catch((err) => {
        console.error('Error:', err);
        return _response(res, 201, false, "Error:", err);
      });
  } else {
    return _response(res, 201, false, "Error:", "note a valid file data");
  }
});