const query = require('@helpers/Query');

module.exports = {
    check: async (_courseId, _categoryId) => {
        const check1SelectCourseId = ['name'];
        const check2SelectCategoryId = ['name'];
        const check3Flag = ['id'];
        const errors = [];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: _courseId,
            },
            status: {
                operator: 'not like',
                value: 'inativo',
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND', 'AND'];

        const whereCheck2 = {
            id: {
                operator: '=',
                value: _categoryId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck2 = ['AND'];

        const whereCheck3 = {
            course_id: {
                operator: '=',
                value: _courseId,
            },
            category_id: {
                operator: '=',
                value: _categoryId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck3 = ['AND', 'AND'];

        const resultCheck1 = await query.Select(
            'courses',
            check1SelectCourseId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        const resultCheck2 = await query.Select(
            'courses',
            check2SelectCategoryId,
            whereCheck2,
            logicalOperatorCheck2,
        );

        const resultCheck3 = await query.Select(
            'courses_flags',
            check3Flag,
            whereCheck3,
            logicalOperatorCheck3,
        );

        console.log(resultCheck1, resultCheck2, resultCheck3);
        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length > 0) {
                return true;
            }

            errors.push({
                courseid: {
                    message: 'Não existe nenhum curso com o ID informado',
                    code: 500,
                },
            });
        } else {
            errors.push({
                error: {
                    message: 'Ocorreu um erro inesperado durante a consulta dos cursos',
                    code: 500,
                    detail: { ...resultCheck1.error },
                },
            });
        }

        if (Array.isArray(resultCheck2).data) {
            if (resultCheck2.data.length > 0) {
                return true;
            }

            errors.push({
                categoryid: {
                    message: 'Não existe nenhuma categoria com o ID informado',
                    code: 500,
                },
            });
        } else {
            errors.push({
                error: {
                    message: 'Ocorreu um erro inesperado durante a consulta das categorias',
                    code: 500,
                    detail: { ...resultCheck2.error },
                },
            });
        }

        if (Array.isArray(resultCheck3.data)) {
            if (resultCheck3.data.length !== 0) {
                return true;
            }

            errors.push({
                flag: {
                    message: 'O curso já pertence à categoria informada',
                    code: 500,
                },
            });
        } else {
            errors.push({
                error: {
                    message: 'Ocorreu um erro inesperado durante a consulta das flags',
                    code: 500,
                    detail: { ...resultCheck3.error },
                },
            });

            console.log(resultCheck3.error);
        }

        if (errors.length !== 0) {
            return errors;
        }

        return true;
    },
};
