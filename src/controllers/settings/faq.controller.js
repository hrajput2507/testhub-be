import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const faqs = async_handler(async (req, res, next) => {
    const location = req.query.location;
    let faqs;
    if (location) {
        faqs = await db_connection.faq_model.findAll({
            where: { location }
        });
    } else {
        faqs = await db_connection.faq_model.findAll({});
    }
    if (!faqs) {
        return next(new ErrorResponse("Unable to fetch faqs", 200));
    }
    return _response(res, 200, true, "Faq listed successfully", faqs);
});

export const add_faq = async_handler(async (req, res, next) => {
    const faq = await db_connection.faq_model.create(req.body);

    if (!faq) {
        return next(new ErrorResponse("Unable to add faq", 200));
    }
    return _response(res, 200, true, "Faq added successfully", faq);
});

export const update_faq = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const update_faq = await db_connection.faq_model.update(
        { ...req.body },
        { where: { faq_id: id } }
    );

    if (!update_faq[0]) {
        return next(new ErrorResponse("Unable to update", 200));
    }
    return _response(res, 200, true, "Faq updated successfully", {});
});

export const delete_faq = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const deleted = await db_connection.faq_model.destroy({ where: { faq_id: id } });
    return _response(res, 200, true, "Faq deleted successfully", {});
});
