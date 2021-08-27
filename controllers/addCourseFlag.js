const query = require('@helpers/Query');

const validateCourseFlag = require('@functions/validateCoursesFlags');
const checkCourseFlag = require('@functions/checkCoursesFlags');

module.exports = {
    post: async (req, res) => {
        const errors = [];
        const { courseid } = req.body;
        const { categoryid } = req.body;

        const validCourseId = validateCourseFlag.validateCourseId(courseid, errors);
        const validCategoryId = validateCourseFlag.validateCategoryId(categoryid, errors);

        if (errors.length > 0) {
            console.log(errors);
            res.end();
        } else {
            const check = await checkCourseFlag.check(validCourseId, validCategoryId);

            if (check !== true) {
                res.sendError(check);
            } else {
                const columns = {
                    course_id: validCourseId,
                    category_id: validCategoryId,
                    created_at: 'now()',
                };
                const returningColumns = ['*'];

                const result = await query.Insert(
                    'courses_flags',
                    columns,
                    returningColumns,
                );

                if (Array.isArray(result.data)) {
                    res.send(result.data);
                } else {
                    res.sendError(result.error, 500);
                }
            }
        }
    },
};
