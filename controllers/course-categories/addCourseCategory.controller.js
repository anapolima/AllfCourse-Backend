// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'addCourseCategory' function of the 'course categories'
//  class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

const checkAddCoursesCategories = require('@app/functions/checkAddCoursesCategories');

exports.addCourseCategory = async (req, res) => {
    const { name } = req.body;

    const check = await checkAddCoursesCategories.check(name);

    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        const columns = {
            name: check.name,
            created_by: 45,
        };
        const returningColumns = ['*'];

        const result = await query.Insert(
            true,
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
};
