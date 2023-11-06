import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { add_blog_category, blog_categories, blog_category, delete_blog_category, update_blog_category } from "../controllers/blog/category.js";
import { add_blog_topic, blog_topic, blog_topics, delete_blog_topic, update_blog_topic } from "../controllers/blog/topic.js";
import { blog, blogs, blogs_initials, delete_blog, save_blog } from "../controllers/blog/blog.js";


const blog_router = express.Router();

blog_router.route("/category").get(protect, blog_categories).post(protect, add_blog_category);
blog_router.route("/category/:id").get(protect, blog_category).put(protect, update_blog_category).delete(protect, delete_blog_category);

blog_router.route("/topic").get(protect, blog_topics).post(protect, add_blog_topic);
blog_router.route("/topic/:id").get(protect, blog_topic).put(protect, update_blog_topic).delete(protect, delete_blog_topic);

blog_router.get('/initials', protect, blogs_initials);
blog_router.route("/").get(protect, blogs).post(protect, save_blog);
blog_router.route("/:id").get(protect, blog).delete(protect, delete_blog);


export default blog_router;
