const fs = require('fs');
const jwt = require('@models/jwt');

//  ----------------------------------------------------------------------------
//  --------------------Middleware to user authentication-----------------------
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth;
    try {
        const payload = await jwt.verify(token);

        req.auth = {
            id: payload.id,
            email: payload.email,
            first_name: payload.first_name,
            type: payload.type,
        };

        console.table({ 'Session-user': req.auth });

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
