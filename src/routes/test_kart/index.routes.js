import express from "express";
import { academy_details } from "../../controllers/test_kart/exam.controller.js";
import { home_bundle } from "../../controllers/test_kart/home.controller.js";

const app_home_router = express.Router();

app_home_router.get("/", home_bundle);
app_home_router.get("/teachers/:slug", academy_details);

export default app_home_router;
