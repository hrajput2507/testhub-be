import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js'
import ErrorResponse from '../../utils/error.util.js';
import _response from '../../utils/response.util.js';

/**
 * Get all teachers
 */
export const studio_dashboard = async_handler(async (req, res, next) => {
    const { academy_id } = req.user;
    const widgets = await widgets_data();
    const earnings = await earnings_data();
    const recent_test_series = await recent_test_series_data(academy_id);
    const recent_comments = await recent_comments_data();
    return _response(res, 200, true, "Dashboard data", { widgets, earnings, recent_test_series, recent_comments });
});

const widgets_data = async_handler(async () => {
    let data = {
        students: {
            total: 0,
            increase: 0,
            change: '+0%'
        },
        earnings: {
            total: 0,
            increase: 0,
            change: '+0%'
        },
        test_series_sell: {
            total: 0,
            increase: 0,
            change: '+0%'
        },
        tests_taken: {
            total: 0,
            increase: 0,
            change: '+0%'
        }
    }
    return data
});

const earnings_data = async_handler(async () => {
    let data = {
        overview: {
            total: 0,
            last_month: 0,
            last_week: 0
        },
        graph: {
            label: [],
            data: [],
        }
    }
    return data
});

const recent_test_series_data = async_handler(async (academy_id) => {
    let data;

    const test_series = await db_connection.test_series_model.findAll({
        where: { academy_id }
    });
    if (!test_series) {
        data = []
    }
    data = test_series
    return data
});

const recent_comments_data = async_handler(async () => {
    let data = []
    return data
});