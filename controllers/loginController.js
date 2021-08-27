require('dotenv').config();
const jwt = require('jsonwebtoken');
const query = require('@helpers/Query');
const Login = require('@functions/checkLogin');

module.exports = {
    post: async (req, res) => {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const { email } = req.body;
        const { password } = req.body;
        const checkSelect = ['id', 'email', 'first_name', 'type', 'password'];
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
        const { rowCount: userFound } = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            checkOperators,
        );
        if (userFound > 0) {
            try {
                await Login.LoginUser(userFound[0].password, password);
                const token = jwt.sign(
                    {
                        id: userFound[0].id,
                        email,
                        name: userFound[0].first_name,
                        type: userFound[0].type,
                    },
                );
                res.cookie('usertoken', token, {
                    httpOnly: true,
                });
                jwt.verify(token, process.env.SECRET, (err, decoded) => {
                    if (err) {
                        console.log(err);
                        errors.criticalErrors.Unauthorized = {
                            message: 'Não autorizado',
                            code: 401,
                        };
                        res.sendError(errors, 401);
                    } else {
                        console.log(decoded);
                        res.status(200).send({ message: 'Login sucedido' });
                    }
                });
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
