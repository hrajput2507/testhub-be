import async_handler from "../../middlewares/async.middleware.js";
import db_connection from "../../models/index.js";
import ErrorResponse from "../../utils/error.util.js";
import _response from "../../utils/response.util.js";

export const get_cart_items = async_handler(async (req, res, next) => {
    try {
        console.log("check student", req.user.student_id);

        db_connection.cart_model.hasOne(db_connection.test_series_model, {
            sourceKey: "test_series_id",
            foreignKey: "test_series_id",
        });

        const cartItems = await db_connection.cart_model.findAll({
            where: { student_id: req.user.student_id },
            include: {
                model: db_connection.test_series_model,
            }
        });

        res.status(200).json({ success: true, data: cartItems });
    }
    catch (err) {
        console.log("error", err);
        return next(new ErrorResponse("Something went wrong, please try again later", 500));
    }
});

export const add_to_cart = async_handler(async (req, res, next) => {
    try {
        const test_series_id = req.body.test_series_id;
        const quantity = req.body.quantity;
        const student_id = req.user.student_id;

        if (!test_series_id || !quantity) {
            return next(new ErrorResponse(`Required fields are missing`, 403));
        }

        const checkCart = await db_connection.cart_model.findOne({
            where: { student_id: req.user.student_id, test_series_id: test_series_id }
        });

        if (checkCart) {
            return next(new ErrorResponse("This item is already added in the cart", 409));
        }

        await db_connection.cart_model.create({ "test_series_id": test_series_id, "quantity": quantity, "student_id": student_id });

        res.status(200).json({ success: true, message: "Addded in the cart successfully." });
    }
    catch (err) {
        console.log("error", err);
        return next(new ErrorResponse("Something went wrong, please try later", 500));
    }
});

export const remove_from_cart = async_handler(async (req, res, next) => {
    try {
        const cart_id = req.body.cart_id;

        if (!cart_id) {
            return next(new ErrorResponse(`Cart ID field is required`, 403));
        }

        await db_connection.cart_model.destroy({ where: { "cart_id": cart_id } });

        res.status(200).json({ success: true, message: "Removed." });
    }
    catch (err) {
        console.log("error", err);
        return next(new ErrorResponse("Something went wrong, please try later", 500));
    }
});

export const clear_cart = async_handler(async (req, res, next) => {
    try {
        await db_connection.cart_model.destroy({ where: { "student_id": req.user.student_id } });
        res.status(200).json({ success: true, message: "Cart has been cleared." });
    }
    catch (err) {
        console.log("error", err);
        return next(new ErrorResponse("Something went wrong, please try later", 500));
    }
});
