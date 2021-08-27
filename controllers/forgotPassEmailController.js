require('dotenv').config();
const query = require('@helpers/Query');
const emailrequest = require('@functions/sendForgotPassEmail');
const crypto = require('crypto');

module.exports = {
    post: async (req, res) => {
        const { email } = req.body;
        const token = crypto.randomBytes(20).toString('hex');
        const checkSelect = ['email', 'first_name'];
        const whereCheck = {
            email: {
                operator: '=',
                value: email,
            },
            active: {
                operator: '=',
                value: true,
            },
            deleted_at: {
                operator: 'is',
                value: null,
            },
        };
        const checkOperators = ['AND', 'AND'];
        const result = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            checkOperators,
        );
        if (Array.isArray(result.data)) {
            if (result.data.length >= 1) {
                try {
                    const expire = new Date();
                    expire.setHours(expire.getHours() + 2);
                    await emailrequest.send(
                        email,
                        result.data[0].first_name,
                        token,
                    );
                    const fieldvalues = {};
                    fieldvalues.recover_token = token;
                    fieldvalues.rtoken_expire = expire;
                    await query.Update(
                        'users',
                        fieldvalues,
                        ['*'],
                        whereCheck,
                        checkOperators,
                    );
                    res.status(201).send({ message: 'Email enviado' });
                } catch (err) {
                    console.log(err);
                    res.sendError('Erro', 500);
                }
            } else {
                res.sendError({ message: 'Email não encontrado ou conta não ativada' }, 404);
            }
        } else {
            console.log(result.data);
            res.sendError('Erro', 500);
        }
    },
};
