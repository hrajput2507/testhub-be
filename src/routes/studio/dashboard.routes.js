import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { studio_dashboard } from "../../controllers/studio/dashboard.controller.js";


const studio_dashboard_routes = express.Router();

studio_dashboard_routes.route('/').get(protect, studio_dashboard)

export default studio_dashboard_routes;
