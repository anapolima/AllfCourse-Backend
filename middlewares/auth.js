const fs = require('fs');
const query = require('@helpers/Query');
const jwt = require('@models/jwt');

//  ----------------------------------------------------------------------------
//  --------------------Middleware to user authentication-----------------------
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth;
    // const token = req.headers['x-access-token'];
    try {
        const payload = await jwt.verify(token);
        const checkSelect = ['id', 'email', 'first_name', 'type'];
        const whereCheck = {
            email: {
                operator: '=',
                value: payload.email,
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
        const checkOperators = ['AND', 'AND', 'AND'];

        const { rowCount: userFound, rows: userAuth } = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            checkOperators,
        );

        if (userFound === 0) {
            return res.status(401).send('Falha na autenticação do usuário');
        }

        req.auth = {
            id: userAuth[0].id,
            email: userAuth[0].email,
            first_name: userAuth[0].first_name,
            type: userAuth[0].type,
        };

        console.table({ 'Session-user': req.auth });
        if (!userAuth[0]) {
            return res.status(401).send('Falha na autenticação do usuário');
        }

        next();
    } catch (error) {
        fs.readFile('./src/logs/data.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const buffer = JSON.parse(data);
                buffer.error.push(error);
                fs.writeFile('./src/logs/data.json', JSON.stringify(buffer), (err) => {
                    console.log(err);
                });
            }
        });
        res.cookie('auth').status(401).send('Falha na autenticação do usuário');
    }
};
// --------------------Middleware to user authentication-----------------------
// ----------------------------------------------------------------------------
module.exports = authMiddleware;
