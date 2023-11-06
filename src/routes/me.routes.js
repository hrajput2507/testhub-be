import express from "express";
import { me, update_me } from "../controllers/auth/me.js";
import { protect } from "../middlewares/auth.middleware.js"


const me_router = express.Router();

me_router.route("/me").get(protect, me).post(protect, update_me);

export default me_router;
