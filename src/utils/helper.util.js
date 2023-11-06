import _ from 'lodash';

export const parse_tests = (tests) => {
    const parsed_tests = [];
    tests.forEach((test) => {
        let raw_value = _.omit(test.dataValues, ['createdAt', 'updatedAt']);
        raw_value.subjects = JSON.parse(raw_value.subjects);
        raw_value.test_series.exam.default_pattern = JSON.parse(raw_value.test_series.exam.default_pattern);
        parsed_tests.push(raw_value);
    });
}