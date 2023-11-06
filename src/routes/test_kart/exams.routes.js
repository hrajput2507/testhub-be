import express from "express";
import {
  exams_grouped_by_category,
  exam_details,
} from "../../controllers/test_kart/exam.controller.js";

const app_exam_router = express.Router();

app_exam_router.get("/", exams_grouped_by_category);
app_exam_router.get("/:slug", exam_details);

export default app_exam_router;
