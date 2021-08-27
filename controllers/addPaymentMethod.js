const query = require('@helpers/Query');

const checkAddPaymentMethod = require('@functions/checkAddPaymentMethod');

module.exports = {
    post: async (req, res) => {
        const { name } = req.body;
        const { installments } = req.body;

        const check = await checkAddPaymentMethod.check(name, installments);

        if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const columns = {
                name: check.name,
                installments: check.installments,
            };
            const returningColumns = ['*'];

            const result = await query.Insert(
                'payment_method',
                columns,
                returningColumns,
            );

            if (Array.isArray(result.data)) {
                res.status(201).send({ message: 'Método de pagamento adicionado com sucesso!' });
            } else {
                res.sendError(result.error, 500);
            }
        }
    },
};
