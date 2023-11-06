import ErrorResponse from "../utils/error.util.js";

export const error_handler = (err, req, res, next) => {
    let error = { ...err };
    console.log(err);
    // console.log(err.parent.code);

    error.message = err.message;
    if (err.name === 'CastError') {
        error = new ErrorResponse(`Resource not found`, 404);
    }

    // error handling for duplicate entry
    if (err?.parent?.code === "ER_DUP_ENTRY") {
        error = new ErrorResponse(`Duplicate entry`, 400);
    }

    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // custome error code and message generator
    res.status(error.statusCode || 500).json({ success: false, data: {}, error: error.message || ' Server Error' });

}