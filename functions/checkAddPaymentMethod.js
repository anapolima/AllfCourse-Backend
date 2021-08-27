const validatePaymentMethod = require('@validations/validatePaymentMethods');
// const query = require('@helpers/Query');

module.exports = {
    check: async (_name, _installments) => {
        // const check1SelectMethodId = ['id'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validMethodName = validatePaymentMethod.validatePaymentMethodName(
            _name,
            errors.validationErrors,
        );

        const validInstallment = validatePaymentMethod.validatePaymentMethodInstallments(
            _installments,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        // const whereCheck1 = {
        //     name: {
        //         operator: 'like',
        //         value: validMethodName
        //     },
        // };
        // const logicalOperatorCheck1 = [''];

        // const resultCheck1 = await query.Select(
        //     'payment_methods',
        //     check1SelectMethodId,
        //     whereCheck1,
        //     logicalOperatorCheck1,
        // );

        // if (Array.isArray(resultCheck1.data)) {
        //     if (resultCheck1.data.length !== 0) {
        //         errors.validationErrors.teacherid = {
        //             message: 'Já existe um método de pagamento com este nome',
        //             code: 500,
        //         };
        //     }
        // } else {
        //     errors.criticalErrors.errorTeacherId = {
        //         message: 'Ocorreu um erro inesperado durante a consulta de métodos de pagamento',
        //         code: 500,
        //         detail: { ...resultCheck1.error },
        //     };
        // }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            name: validMethodName,
            installments: validInstallment,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
