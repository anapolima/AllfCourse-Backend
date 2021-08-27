require('dotenv').config();
const newuserpass = require('@functions/checkResetPassToken');

module.exports = {
    post: async (req, res) => {
        const { token } = req.body;
        const { newpass } = req.body;
        const { confirmnewpass } = req.body;
        try {
            const check = await newuserpass.check(token, newpass, confirmnewpass);
            if (check !== true) {
                res.sendError(check, 500);
            } else {
                res.status(201).send({ message: 'Senha alterada com sucesso' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
