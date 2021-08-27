const query = require('@helpers/Query');

const checkAddCoursesCategories = require('@app/functions/checkAddCoursesCategories');

module.exports = {
    post: async (req, res) => {
        const { name } = req.body;

        const check = await checkAddCoursesCategories.check(name);

        if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const columns = {
                name: check.name,
                created_by: 45,
                created_at: 'now()',
            };
            const returningColumns = ['*'];

            const result = await query.Insert(
                'courses_categories',
                columns,
                returningColumns,
            );

            if (Array.isArray(result.data)) {
                res.status(201).send({ message: 'Categoria adicionada com sucesso!' });
            } else {
                res.sendError(result.error, 500);
            }
        }
    },
};
