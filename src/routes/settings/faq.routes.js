import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { add_faq, delete_faq, faqs, update_faq } from "../../controllers/settings/faq.controller.js";

const faq_router = express.Router();

faq_router.route("/").get(protect, faqs).post(protect, add_faq);
faq_router.route("/:id").put(protect, update_faq).delete(protect, delete_faq);

export default faq_router;
