import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  student_login,
  student_signup,
} from "../../controllers/student/auth.controller.js";
import {
  get_student_preferences,
  get_student_profile,
  update_student_preferences,
  update_student_profile,
} from "../../controllers/student/settings.controller.js";
import { student_test_series } from "../../controllers/student/test-series.controller.js";
import {
  create_test_session,
  start_demo_test,
  start_test,
  submit_test,
  update_test_session,
  validate_test_session,
} from "../../controllers/student/test.controller.js";

const student_router = express.Router();

/** Student Auths */
student_router.route("/auth/signup").post(student_signup);
student_router.route("/auth/login").post(student_login);

/** settings */
student_router
  .route("/settings/profile")
  .get(protect, get_student_profile)
  .post(protect, update_student_profile);
student_router
  .route("/settings/preferences")
  .get(protect, get_student_preferences)
  .post(protect, update_student_preferences);

/** Student Test series */
student_router.route("/test-series").get(protect, student_test_series);

/** Only For DEMO */
student_router.route("/portal/:test_id").get(start_demo_test);

/** Student Test Sessions */
student_router.route("/test/:test_id").get(protect, create_test_session);
student_router
  .route("/test/validate/:test_session_id")
  .get(protect, validate_test_session);
student_router.route("/test/start/:test_session_id").get(protect, start_test);
student_router
  .route("/test/update/:test_session_id")
  .post(protect, update_test_session);
student_router
  .route("/test/submit/:test_session_id")
  .post(protect, submit_test);

export default student_router;
