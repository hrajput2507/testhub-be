import express from "express";
import {
  get_published_blogs,
  get_single_blog,
} from "../../controllers/test_kart/blog.controller.js";

const app_blogs_router = express.Router();

app_blogs_router.get("/", get_published_blogs);
app_blogs_router.get("/:slug", get_single_blog);

export default app_blogs_router;
