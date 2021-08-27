require('dotenv').config();
const tokencheck = require('@functions/checkValidAccountToken');

module.exports = {
    post: async (req, res) => {
        const { token } = req.body;
        try {
            const result = await tokencheck.check(token);
            if (result !== true) {
                res.sendError({ message: result[0] }, 500);
            } else {
                res.status(201).send({ message: 'Conta validada com sucesso' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
