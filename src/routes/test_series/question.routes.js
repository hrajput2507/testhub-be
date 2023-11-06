import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  add_question,
  delete_question,
  get_question,
  get_questions,
  import_questions,
  update_question,
} from "../../controllers/series/question.controller.js";

const question_router = express.Router();
question_router
  .route("/")
  .get(protect, get_questions)
  .post(protect, add_question);
question_router
  .route("/:id")
  .get(protect,get_question)
  .put(protect, update_question)
  .delete(protect, delete_question);

question_router.route("/import/:test_id").post(import_questions);


export default question_router;
