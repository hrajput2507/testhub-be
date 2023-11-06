import express from "express";
import { login } from "../controllers/auth/login.js";
import { signup } from "../controllers/auth/signup.js"


const auth_router = express.Router();

auth_router.post("/signup", signup)
auth_router.post("/login", login)

export default auth_router;
