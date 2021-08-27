const query = require('@helpers/Query');

const checkCourseFlag = require('@functions/checkCoursesFlags');

module.exports = {
    post: async (req, res) => {
        const errors = [];
        const { courseid } = req.body;
        const { categoryid } = req.body;

        if (errors.length > 0) {
            console.log(errors);
            res.end();
        } else {
            const check = await checkCourseFlag.check(courseid, categoryid);
            console.log('check', check);

            if (Object.keys(check.validationErrors).length !== 0
                || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
            } else {
                const columns = {
                    course_id: check.courseid,
                    category_id: check.categoryid,
                    created_at: 'now()',
                };
                const returningColumns = ['*'];

                const result = await query.Insert(
                    'courses_flags',
                    columns,
                    returningColumns,
                );

                if (Array.isArray(result.data)) {
                    res.status(201).send({ message: 'Flag adicionada com sucesso!' });
                } else {
                    res.sendError(result.error, 500);
                }
            }
        }
    },
};
