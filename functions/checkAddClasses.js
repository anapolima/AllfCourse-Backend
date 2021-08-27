const validateClass = require('@validations/validateClasses');
const query = require('@helpers/Query');
// test
module.exports = {
    check: async (_name, _order, _moduleId, _inactive, _link, _description) => {
        const check1SelectTeacherName = ['id'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validClassName = validateClass.validateClassName(
            _name,
            errors.validationErrors,
        );

        const validOrder = validateClass.validateClassOrder(
            _order,
            errors.validationErrors,
        );

        const validModuleId = validateClass.validateClassModuleId(
            _moduleId,
            errors.validationErrors,
        );

        const validInactive = validateClass.validateClassInactive(
            _inactive,
            errors.validationErrors,
        );

        const validLink = validateClass.validateClassVideoLink(
            _link,
            errors.validationErrors,
        );

        const validDescription = validateClass.validateClassDescription(
            _description,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validModuleId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'modules',
            check1SelectTeacherName,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.teacherid = {
                    message: 'Não existe nenhum módulo com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorTeacherId = {
                message: 'Ocorreu um erro inesperado durante a consulta de módulos',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            name: validClassName,
            moduleid: validModuleId,
            order: validOrder,
            description: validDescription,
            inactive: validInactive,
            link: validLink,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
