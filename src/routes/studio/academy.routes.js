import express from "express";
import { academies, academy, add_academy, update_academy } from "../../controllers/studio/academy.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";


const academy_routes = express.Router();

academy_routes.route('/').get(protect, academies).post(protect, add_academy)
academy_routes.route('/:id').get(protect, academy).post(protect, update_academy)

export default academy_routes;
