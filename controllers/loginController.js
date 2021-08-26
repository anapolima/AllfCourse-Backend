require('dotenv').config();
const jwt = require('jsonwebtoken');
const query = require('@helpers/Query');
const Login = require('@functions/checkLogin');

module.exports = {
    post: async (req, res) => {
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
        const result = await query.Select('users', checkSelect, whereCheck, checkOperators);
        if (Array.isArray(result.data)) {
            if (result.data.length >= 1) {
                try {
                    await Login.LoginUser(result.data[0].password, password);
                    const token = jwt.sign(
                        {
                            id: result.data[0].id,
                            email,
                            name: result.data[0].first_name,
                            type: result.data[0].type,
                        },
                        process.env.SECRET,
                    );
                    res.cookie('usertoken', token, {
                        httpOnly: true,
                    });
                    jwt.verify(token, process.env.SECRET, (err, decoded) => {
                        if (err) {
                            console.log(err);
                            res.sendError('Não autorizado', 401);
                        } else {
                            console.log(decoded);
                            res.status(200).send({ message: 'Login sucedido' });
                        }
                    });
                } catch (err) {
                    if (err === 1) {
                        res.sendError('Senha incorreta', 403);
                    } else {
                        console.log(err);
                        res.sendError('Erro', 500);
                    }
                }
            } else {
                res.sendError('Email não encontrado ou conta não ativada', 404);
            }
        } else {
            console.log(result.data);
            res.sendError('Erro', 500);
        }
    },
};
