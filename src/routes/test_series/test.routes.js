import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { add_test, delete_test, test, tests, update_test } from "../../controllers/series/test.controller.js";


const test_router = express.Router();
test_router.route("/").get(protect, tests).post(protect, add_test);
test_router.route("/:id").get(protect, test).put(protect, update_test).delete(protect, delete_test);

export default test_router;
