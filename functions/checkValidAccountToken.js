const query = require('@helpers/Query');
require('dotenv').config();

async function check(token) {
    let now = new Date();
    const now_converted = now.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
    });
    now = now_converted;

    const checkSelect1 = ['email_token', 'etoken_expire'];
    const whereCheck1 = {
        email_token: {
            operator: '=',
            value: token,
        },
    };
    const check1 = await query.Select('users', checkSelect1, whereCheck1, ['']);
    // console.log(now_converted);
    if (check1.data.length >= 1) {
        const expire = new Date(check1.data[0].etoken_expire);
        /* console.log(expire.toLocaleString("en-US", {
            timeZone: "America/Sao_Paulo",
        })); */
        if (new Date(now_converted).getTime() < new Date(expire).getTime()) {
            const whereColumns = {
                email_token: {
                    operator: '=',
                    value: token,
                },
            };
            const fieldsValue = {};
            fieldsValue.active = true;
            fieldsValue.email_token = null;
            fieldsValue.etoken_expire = null;
            await query.Update('users', fieldsValue, ['*'], whereColumns, ['']);
            return true;
        }
        return ['Token Expirado', 500];
    }
    return ['Token Inválido', 404];
}

module.exports = { check };
