import express from "express";
import { add_contact, contacts } from "../../controllers/studio/contacts.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";


const contact_router = express.Router();
contact_router.route('/').post(add_contact)
contact_router.route('/').get(contacts)

export default contact_router;
