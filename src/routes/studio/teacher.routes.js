import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { add_teacher, teachers, update_teacher } from "../../controllers/studio/teachers.controller.js";


const teacher_user_routes = express.Router();

teacher_user_routes.route('/').get(protect, teachers).post(protect, add_teacher)
teacher_user_routes.route('/:id').post(protect, update_teacher)

export default teacher_user_routes;
