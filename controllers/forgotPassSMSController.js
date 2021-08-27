require('dotenv').config();
const query = require('@helpers/Query');
const smsrequest = require('@functions/sendForgotPassSMS');
const crypto = require('crypto');

module.exports = {
    post: async (req, res) => {
        const { phone } = req.body;
        const token = crypto.randomBytes(20).toString('hex');

        const checkSelect = ['phone'];
        const whereCheck = {
            phone: {
                operator: '=',
                value: parseInt(phone, 10),
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
                    const smsresult = await smsrequest.send(phone, token);
                    if (smsresult === true) {
                        const expire = new Date();
                        expire.setHours(expire.getHours() + 2);
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
                        res.status(201).send({ message: 'SMS enviado' });
                    } else {
                        res.sendError(smsresult, 500);
                    }
                } catch (err) {
                    console.log(err);
                    res.sendError('Erro', 500);
                }
            } else {
                res.sendError({
                    message:
                    'Telefone não encontrado ou conta não ativada',
                },
                404);
            }
        } else {
            console.log(result.data);
            res.sendError('Erro', 500);
        }
    },
};
