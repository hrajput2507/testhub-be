import express from "express";
import {
  list_tests,
  list_test_series,
} from "../../controllers/test_kart/test-series.controller.js";

const app_series_router = express.Router();

app_series_router.get("/", list_test_series);
app_series_router.get("/:hash", list_tests);

export default app_series_router;
