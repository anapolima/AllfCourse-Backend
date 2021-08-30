// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for delete a class from a course
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkPaymentMethod = require('@app/functions/checkIfPaymentMethodExists');

exports.deletePaymentMethod = async (req, res) => {
    const paymentMethodId = req.params.id.toString();
    console.log(paymentMethodId);
    const userType = req.auth.id;

    if (userType === 4 || userType === 5
        || userType === 6 || userType === 7) {
        const check = await checkPaymentMethod.check(paymentMethodId);

        if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const paymentColumns = {
                deleted_at: 'now()',
            };
            const wherePayment = {
                id: {
                    operator: '=',
                    value: check.id,
                },
            };
            const logicalOperators = [''];
            const returning = ['id', 'deleted_at'];

            const paymentMethodsInformations = await query.Update(
                true,
                'payment_method',
                paymentColumns,
                returning,
                wherePayment,
                logicalOperators,
            );

            if (Array.isArray(paymentMethodsInformations.data)) {
                if (paymentMethodsInformations.data.length > 0) {
                    res.status(200).send({ message: 'Método de pagamento excluído com sucesso!' });
                } else {
                    res.sendError('Alguma coisa ocorreu errado', 500);
                }
            } else {
                res.sendError(paymentMethodsInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
