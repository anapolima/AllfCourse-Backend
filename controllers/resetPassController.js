require('dotenv').config();
const newuserpass = require('@functions/checkResetPassToken');

module.exports = {
    post: async (req, res) => {
        const { token } = req.body;
        const { newpass } = req.body;
        try {
            const result = await newuserpass.check(token, newpass);
            if (result !== true) {
                res.sendError(result[0], result[1]);
            } else {
                res.status(201).send({ message: 'Senha alterada com sucesso' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
