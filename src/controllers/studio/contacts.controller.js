import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import ErrorResponse from '../../utils/error.util.js';


/**
 * Add contact
 */
export const add_contact = async_handler(async (req, res, next) => {
    try {
        const { name, email, phone_number, institute_name, message } = req.body;

        if (!name || !email || !phone_number || !institute_name || !message) {
            return next(new ErrorResponse(`Required fields are missing`, 403));
        }

        const checkUser = await db_connection.contact_model.findOne({
            where: { email: email },
        });

        if (checkUser) {
            return next(new ErrorResponse("You have alredy contacted with the same email address", 409));
        }

        await db_connection.contact_model.create({ name, email, phone_number, institute_name, message });

        res.status(200).json({ success: true, message: "Thank you for contacting us,  we will contact you shortly!" });
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Get all contacts
 */
export const contacts = async_handler(async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit ? req.query.limit : 20);   // number of records per page
        let offset = parseInt(req.query.offset ? req.query.offset : 0);

        const contacts = await db_connection.contact_model.findAndCountAll({
            offset: offset,
            limit: limit
        });

        res.status(200).json({ success: true, data: contacts });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});