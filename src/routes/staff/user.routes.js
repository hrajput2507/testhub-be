import express from "express";
import {
  add_staff,
  staffs,
  staff_profile,
  update_staff,
  update_staff_profile,
} from "../../controllers/staff/staff_users.js";
import { protect } from "../../middlewares/auth.middleware.js";

const staff_user_routes = express.Router();

staff_user_routes
  .route("/profile")
  .get(protect, staff_profile)
  .post(protect, update_staff_profile);

staff_user_routes.route("/").get(protect, staffs).post(protect, add_staff);
staff_user_routes.route("/:id").post(protect, update_staff);

export default staff_user_routes;
