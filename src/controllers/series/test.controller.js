import async_handler from '../../middlewares/async.middleware.js';
import db_connection from '../../models/index.js';
import ErrorResponse from '../../utils/error.util.js';
import _response from '../../utils/response.util.js';

export const tests = async_handler(async (req, res, next, json = false) => {

    const series_id = req.query.series_id;

    /* Associating blog category and balog topic */
    db_connection.test_model.hasOne(db_connection.test_series_model, { sourceKey: 'test_series_id', foreignKey: 'test_series_id' });
    db_connection.test_series_model.hasOne(db_connection.exams_model, { sourceKey: 'exam_id', foreignKey: 'exam_id' });

    let result = [];
    let tests = await db_connection.test_model.findAll({
        include: [
            {
                model: db_connection.test_series_model,
                attributes: ['title'],
                include: [
                    {
                        model: db_connection.exams_model,
                        attributes: ['exam_id', 'exam', 'default_pattern'],
                    }
                ]
            }
        ],
        where: {
            test_series_id: series_id
        }
    });

    // tests.forEach((test) => {
    //     let temp_data = { data: test };
    //     test.subjects = JSON.parse(test.subjects);
    //     let total_questions = 0;
    //     let subjects = [];
    //     test.subjects.forEach((subject) => {
    //         if (subject.inclued) {
    //             total_questions += subject.total_questions;
    //             subjects.push(subject.label);
    //         }
    //     });
    //     let meta = {};
    //     meta.total_questions = total_questions;
    //     if (subjects.length === test.subjects.length) {
    //         meta.subjects = 'All subjects'
    //     } else {
    //         meta.subjects = subjects.join(', ')
    //     }
    //     temp_data.meta = meta;
    //     result.push(temp_data);
    // });

    for (let [i, test] of tests.entries()) {
        let temp_data = { data: test };
        tests[i].subjects = JSON.parse(tests[i].subjects);
        let total_questions = 0;
        let questions_count = 0;
        let subjects = [];
        for (let [j, subject] of tests[i].subjects.entries()) {
            if (subject.inclued) {
                const count = await db_connection.question_model.count({
                    where: {
                        test_id: test.test_id,
                        subject_id: subject.subject_id
                    }
                });
                total_questions += subject.total_questions;
                subjects.push(subject.label);
                questions_count += count;
                tests[i].subjects[j] = { ...subject, question_count: count }
            }
        }

        let meta = {};
        meta.total_questions = total_questions;
        meta.questions_count = questions_count;
        if (subjects.length === tests[i].subjects.length) {
            meta.subjects = 'All subjects'
        } else {
            meta.subjects = subjects.join(', ')
        }
        temp_data.meta = meta;
        result.push(temp_data);
    }

    if (!tests) {
        return next(new ErrorResponse('Unable to fetch tests', 200))
    }

    return _response(res, 200, true, 'Tests found sucessfully', result, json)
})

export const add_test = async_handler(async (req, res, next) => {

    let data = req.body;

    data.subjects = JSON.stringify(data.subjects);

    const test = await db_connection.test_model.create(data);

    if (!test) {
        return next(new ErrorResponse('Unable to create test', 200))
    }

    return _response(res, 200, true, 'Test created sucessfully', test)
})

export const test = async_handler(async (req, res, next, json = false) => {
    const id = req.params.id;
    /* Associating blog category and balog topic */
    db_connection.test_model.hasOne(db_connection.test_series_model, { sourceKey: 'test_series_id', foreignKey: 'test_series_id' });
    db_connection.test_series_model.hasOne(db_connection.exams_model, { sourceKey: 'exam_id', foreignKey: 'exam_id' });

    let tests = await db_connection.test_model.findAll({
        include: [
            {
                model: db_connection.test_series_model,
                attributes: ['title'],
                include: [
                    {
                        model: db_connection.exams_model,
                        attributes: ['exam_id', 'exam', 'default_pattern'],
                    }
                ]
            }
        ],
        where: {
            test_id: id
        }
    });

    if (!tests) {
        return next(new ErrorResponse(`Unable to fetch test with id ${id}`, 200))
    }

    tests[0].subjects = JSON.parse(tests[0].subjects);

    for (let [i, subject] of tests[0].subjects.entries()) {
        const count = await db_connection.question_model.count({
            where: {
                test_id: id,
                subject_id: subject.subject_id
            }
        });
        tests[0].subjects[i] = { ...subject, question_count: count }
    }

    return _response(res, 200, true, 'Test found sucessfully', tests, json)
})

export const update_test = async_handler(async (req, res, next) => {
    const id = req.params.id;
    let data = req.body;
    data.subjects = JSON.stringify(data.subjects);

    const updated_category = await db_connection.test_model.update(
        { ...data },
        { where: { test_id: id } }
    );

    if (!updated_category[0]) {
        return next(new ErrorResponse('Unable to update', 200))
    }
    res.status(200).json({ success: true, data: {} });
})

export const delete_test = async_handler(async (req, res, next) => {
    const id = req.params.id;
    const delete_question = await db_connection.question_model.destroy({where:{test_id:id}});
    const delete_test = await db_connection.test_model.destroy({where:{test_id:id}});
    res.status(200).json({ success: true });
})