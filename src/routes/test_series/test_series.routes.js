import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { add_test_series, all_test_series, delete_test_series, test_series, update_test_series } from "../../controllers/series/test_series.controller.js";
import { verify_publish, publish_status, publish, list, unlist } from "../../controllers/series/status.controller.js";


const test_series_router = express.Router();

test_series_router.route("/").get(protect, all_test_series).post(protect, add_test_series);
test_series_router.route("/:id").get(protect, test_series).put(protect, update_test_series).delete(protect, delete_test_series);
test_series_router.route("/:id/verify").get(protect, verify_publish, publish_status);
test_series_router.route("/:id/publish").post(protect, verify_publish, publish);
test_series_router.route("/:id/list").get(protect, verify_publish, list);
test_series_router.route("/:id/unlist").get(protect, verify_publish, unlist);

export default test_series_router;
