import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const leads_teachers = async_handler(
  async (req, res, next, json = false) => {
    const leads = await db_connection.lead_teachers_model.findAll({});

    if (!leads) {
      return next(new ErrorResponse("Unable to fetchleads", 200));
    }

    return _response(res, 200, true, "Leads have been fetched", leads, json);
  }
);

export const add_lead_teachers = async_handler(async (req, res, next) => {
  try {
    const { name, email, mobile_number, academy } = req.body;

    if (!name || !email || !mobile_number || !academy) {
      return next(new ErrorResponse(`Required fields are missing`, 403));
    }

    const checkLead = await db_connection.lead_teachers_model.findOne({
      where: { email: email },
    });

    if (checkLead) {
      return next(new ErrorResponse("You have alredy joined", 409));
    }

    await db_connection.lead_teachers_model.create(req.body);

    res.status(200).json({ success: true, message: "Thank you for joining testKart,  we will contact you shortly!" });
  }
  catch (err) {
    console.log("error on joining teacher", err);
    return next(new ErrorResponse("Unable to join, please try later", 500));
  }
});

export const lead_teachers = async_handler(async (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({ success: true });
});

export const update_lead_teachers = async_handler(async (req, res, next) => {
  const id = req.params.id;
  const updated_lead = await db_connection.subjects_model.update(
    { ...req.body },
    { where: { subject_id: id } }
  );

  if (!updated_lead[0]) {
    return next(new ErrorResponse("Unable to update", 200));
  }
  res.status(200).json({ success: true, data: {} });
});

export const delete_lead_teachers = async_handler(async (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({ success: true });
});
