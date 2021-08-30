// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for delete a class from a course
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkClass = require('@app/functions/checkIfClassExists');

exports.deleteClass = async (req, res) => {
    const classId = req.params.id.toString();
    // const userType = req.auth.id;

    // if (userType === 1 || userType === 3) {

    const check = await checkClass.check(classId);

    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        const classColumns = {
            deleted_at: 'now()',
        };
        const whereClass = {
            id: {
                operator: '=',
                value: check.id,
            },
        };
        const logicalOperators = [''];
        const returning = ['id', 'deleted_at'];

        const paymentMethodsInformations = await query.Update(
            true,
            'classes',
            classColumns,
            returning,
            whereClass,
            logicalOperators,
        );

        if (Array.isArray(paymentMethodsInformations.data)) {
            if (paymentMethodsInformations.data.length > 0) {
                res.status(200).send({ message: 'Aula excluída com sucesso!' });
            } else {
                res.sendError('Alguma coisa ocorreu errado', 500);
            }
        } else {
            res.sendError(paymentMethodsInformations.error, 500);
        }
    }

    // } else {
    //     res.status(401).send({ message: 'Não autorizado' });
    // }
};
