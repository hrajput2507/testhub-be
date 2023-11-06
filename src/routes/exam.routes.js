import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import { add_exam_category, delete_exam_category, exam_categories, exam_category, update_exam_category } from "../controllers/exam/category.js";
import { exam_content, exam_contents, save_exam_content } from "../controllers/exam/content.js";
import { add_exam, delete_exam, exam, exams, parsed_exams, update_exam } from "../controllers/exam/exam.js";
import { add_exam_subject, delete_exam_subject, exam_subject, exam_subjects, update_exam_subject } from "../controllers/exam/subject.js";


const exam_router = express.Router();

exam_router.route("/subject").get(protect, exam_subjects).post(protect, add_exam_subject);
exam_router.route("/subject/:id").get(protect, exam_subject).put(protect, update_exam_subject).delete(protect, delete_exam_subject);

exam_router.route("/category").get(protect, exam_categories).post(protect, add_exam_category);
exam_router.route("/category/:id").get(protect, exam_category).put(protect, update_exam_category).delete(protect, delete_exam_category);

exam_router.route("/exam").get(protect, exams).post(protect, add_exam);
exam_router.route("/exam/:id").get(protect, exam).put(protect, update_exam).delete(protect, delete_exam);

exam_router.route("/content").get(protect, exam_contents).post(protect, save_exam_content);
exam_router.get("/content/:id", protect, exam_content);

exam_router.get("/parsed", protect, parsed_exams);

export default exam_router;
