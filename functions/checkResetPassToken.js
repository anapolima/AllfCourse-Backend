const query = require('@helpers/Query');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function check(token, newpass) {
    let now = new Date();
    const now_converted = now.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
    });
    now = now_converted;

    const checkSelect1 = ['recover_token', 'rtoken_expire'];
    const whereCheck1 = {
        recover_token: {
            operator: '=',
            value: token,
        },
    };
    const check1 = await query.Select('users', checkSelect1, whereCheck1, ['']);
    // console.log(now_converted);
    if (check1.data.length >= 1) {
        const expire = new Date(check1.data[0].rtoken_expire);
        /* console.log(expire.toLocaleString("en-US", {
            timeZone: "America/Sao_Paulo",
        })); */
        if (new Date(now_converted).getTime() < new Date(expire).getTime()) {
            const whereColumns = {
                recover_token: {
                    operator: '=',
                    value: token,
                },
            };
            const fieldsValue = {};
            fieldsValue.recover_token = null;
            fieldsValue.rtoken_expire = null;
            fieldsValue.password = bcrypt.hashSync(newpass, 10);
            await query.Update('users', fieldsValue, ['*'], whereColumns, ['']);
            return true;
        }
        return ['Token Expirado', 500];
    }
    return ['Token Inválido', 404];
}

module.exports = { check };
