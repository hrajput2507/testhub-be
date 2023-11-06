import user_type from '../../../config/user_type.js';
import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import ErrorResponse from '../../utils/error.util.js';

export const me = async_handler(async (req, res, next) => {

    let user;

    if (req.user_type === user_type.staff) {
        user = await db_connection.user_staff_model.findOne(
            { where: { staff_id: req.user.staff_id } }
        );
    }

    const user_data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
    }

    res.status(200).json({ success: true, data: { user: user_data } });

});

export const update_me = async_handler(async (req, res, next) => {

    let user_updated;
    let user;
    let update_values = {};

    const { first_name, last_name, bio, avatar } = req.body;

    if (first_name) {
        update_values.first_name = first_name
    }
    if (last_name) {
        update_values.last_name = last_name
    }
    if (bio) {
        update_values.bio = bio
    }
    if (avatar) {
        update_values.avatar = avatar
    }

    if (req.user_type === user_type.staff) {
        user_updated = await db_connection.user_staff_model.update(
            { ...update_values },
            { where: { staff_id: req.user.staff_id } }
        );
    }

    if (!user_updated[0]) {
        console.log('not updated');
        return next(new ErrorResponse('Unable to update', 200))
    }


    if (req.user_type === user_type.staff) {
        user = await db_connection.user_staff_model.findOne(
            { where: { staff_id: req.user.staff_id } }
        );
    }

    const user_data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
    }

    res.status(200).json({ success: true, data: { user: user_data } });

});