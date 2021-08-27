const query = require('@helpers/Query');
require('dotenv').config();

const emailrequest = require('@functions/sendConfirmationEmail');
const crypto = require('crypto');

module.exports = {
    post: async (req, res) => {
        const { email } = req.body;
        const token = crypto.randomBytes(20).toString('hex');
        const expire = new Date();
        expire.setHours(expire.getHours() + 2);
        try {
            const checkSelect = ['email', 'first_name'];
            const whereCheck = {
                email: {
                    operator: '=',
                    value: email,
                },
                deleted_at: {
                    operator: 'is',
                    value: null,
                },
            };
            const checkOperators = ['AND'];
            const check = await query.Select(
                'users',
                checkSelect,
                whereCheck,
                checkOperators,
            );
            console.log(check);
            if (Array.isArray(check.data)) {
                if (check.data.length >= 1) {
                    const fieldvalues = {};
                    fieldvalues.email_token = token;
                    fieldvalues.etoken_expire = expire;
                    await query.Update(
                        'users',
                        fieldvalues,
                        ['*'],
                        whereCheck,
                        checkOperators,
                    );
                    await emailrequest.send(
                        email,
                        check.data[0].first_name,
                        token,
                    );
                    res.status(201).send({ message: 'Novo token gerado e e-mail enviado' });
                } else {
                    res.sendError({ message: 'Email não encontrado' }, 404);
                }
            }
        } catch (err) {
            console.log(err);
            res.sendError('erro', 500);
        }
    },
};
