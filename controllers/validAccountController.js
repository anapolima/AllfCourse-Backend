require('dotenv').config();
const tokencheck = require('@functions/checkValidAccountToken');

module.exports = {
    post: async (req, res) => {
        const { token } = req.body;
        try {
            const result = await tokencheck.check(token);
            if (result !== true) {
                res.sendError(result[0], result[1]);
            } else {
                res.status(201).send('Conta validada com sucesso');
            }
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
