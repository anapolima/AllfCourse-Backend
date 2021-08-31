// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getCoursesByLoggedUser' function of the 'courses' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

exports.getCoursesByLoggedUser = async (req, res) => {
    const userType = req.auth.type;
    const loggedUser = req.auth.id;

    if (userType !== 2 && userType !== 4 && userType !== 6) {
        const columns = [
            'courses.id AS course_id',
            'courses.name AS course_name',
            'courses.description AS course_description',
            'courses.banner_img AS course_image',
            'CONCAT(\'R$\', courses.price) AS value',
            'courses.status AS status',
            'courses.created_at AS create_date',
            'courses.teacher_id AS teacher_id',
            'CONCAT(users.first_name, \' \', users.last_name) AS teacher_name',
            `CASE
            WHEN
                enroll_students.id IS NOT NULL
            THEN
                true
            WHEN
                enroll_students.id IS NULL
            THEN
                false
            END AS enrolled`,
            'enroll_students.id AS enroll_id',
            'enroll_students.finished AS finished',
            `(
                SELECT
                    COUNT(enroll_students.id) as total_enrolleds
                FROM
                    enroll_students
                RIGHT JOIN
                    courses
                ON
                    courses.id = enroll_students.course_id
                AND
                    courses.deleted_at IS NULL
            )`,
        ];
        const table = ['courses'];
        const where = {
            'courses.deleted_at': {
                operator: 'is',
                value: 'null',
            },
        };
        const logicalOperator = [''];
        const join = {
            enroll_students: {
                join: 'left join',
                on: {
                    course_id: {
                        operator: '=',
                        value: 'courses.id',
                    },
                    student_id: {
                        operator: '=',
                        value: loggedUser,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                },
                logicalOperators: ['AND', 'AND'],
            },
            users: {
                join: 'join',
                on: {
                    id: {
                        operator: '=',
                        value: 'courses.teacher_id',
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                },
                logicalOperators: ['AND'],
            },
        };
        const order = ['courses.name'];

        const courses = await query.Select(
            table,
            columns,
            where,
            logicalOperator,
            order,
            join,
        );

        if (Array.isArray(courses.data)) {
            res.status(200).send(courses.data);
        } else {
            res.sendError('Ocorreu um problema durante a consulta de cursos', 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
