import express from "express";
import { add_lead_teachers } from "../../controllers/test_kart/leads.controller.js";

const app_leads_router = express.Router();

app_leads_router.post("/teachers/join", add_lead_teachers);

export default app_leads_router;
