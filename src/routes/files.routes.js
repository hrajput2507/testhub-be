import express from "express";
import { delete_file, upload_file } from "../controllers/files/file.js";
import { protect } from "../middlewares/auth.middleware.js";

const file_router = express.Router();

file_router.route("/upload").post(protect, upload_file);
file_router.route("/delete").delete(protect, delete_file);

export default file_router;
