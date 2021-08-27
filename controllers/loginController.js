require('dotenv').config();
const jwt = require('@model/jwt');
const query = require('@helpers/Query');
const Login = require('@functions/checkLogin');

module.exports = {
    get: async (req, res) => {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const [, hash] = req.headers.authorization.split(' ');
        const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

        const checkSelect = ['id', 'email', 'first_name', 'type', 'password'];
        const whereCheck = {
            email: {
                operator: '=',
                value: email,
            },
            active: {
                operator: 'is',
                value: true,
            },
            deleted_at: {
                operator: 'is',
                value: null,
            },
        };
        const checkOperators = ['AND', 'AND'];
        const { rowCount: userFound } = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            checkOperators,
        );

        if (userFound > 0) {
            try {
                await Login.LoginUser(userFound[0].password, password);
                const token = jwt.sign({
                    id: userFound[0].id,
                    email,
                    name: userFound[0].first_name,
                    type: userFound[0].type,
                });

                res.cookie('auth', token, {
                    httpOnly: true,
                });

                res.status(200).send({ message: 'Login sucedido', token });
            } catch (err) {
                if (err === 1) {
                    res.sendError({ message: 'Senha incorreta' }, 403);
                } else {
                    errors.criticalErrors.errorCategory = {
                        message: 'Ocorreu um erro inesperado.',
                        code: 500,
                        detail: { ...err },
                    };
                    res.sendError(errors, 500);
                }
            }
        } else {
            errors.criticalErrors.email = {
                message: 'Email não encontrado ou conta não ativada',
                code: 404,
            };
            res.sendError(errors, 404);
        }
    },
};
