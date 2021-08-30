const query = require('@helpers/Query');
const validateClass = require('@validations/validateClasses');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validClassId = validateClass.validateClassId(
            _id,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectClassId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validClassId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'classes',
            check1SelectClassId,
            whereCheck1,
            logicalOperatorCheck1,
        );
        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhuma aula com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta das aulas',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validClassId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
