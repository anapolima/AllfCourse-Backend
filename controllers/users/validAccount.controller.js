require('dotenv').config();
const tokencheck = require('@functions/checkValidAccountToken');

module.exports = {
    post: async (req, res) => {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const { token } = req.body;
        try {
            const result = await tokencheck.check(token);
            if (result !== true) {
                res.sendError(result, 500);
            } else {
                res.status(201).send({ message: 'Conta validada com sucesso' });
            }
        } catch (err) {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado.',
                code: 500,
                detail: { ...err },
            };
            res.sendError(errors, 500);
        }
    },
};
