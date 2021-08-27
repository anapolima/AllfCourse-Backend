const fs = require('fs');
const query = require('@helpers/Query');
const jwt = require('@models/jwt');

//  ----------------------------------------------------------------------------
//  --------------------Middleware to user authentication-----------------------
const authQuery = `
      SELECT
        users.id,
        users.username,
        offices.description AS office
      FROM users
      JOIN offices
        ON offices.id = users.office_id
      WHERE
           users.id = $1
      AND  users.username = $2
      AND  offices.description = $3
      AND  users.deleted_at isnull`;

const authMiddleware = async (req, res, next) => {
    // const token = req.cookies["auth"];
    const token = req.headers['x-access-token'];

    try {
        const payload = await jwt.verify(token);
        const { rows: userAuth } = await query(authQuery, [
            payload.id,
            payload.username,
            payload.office,
        ]);

        req.auth = {
            id: userAuth[0].id,
            username: userAuth[0].username,
            office: userAuth[0].office,
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
