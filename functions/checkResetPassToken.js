/* eslint-disable no-unused-vars */
const query = require('@helpers/Query');
const validateNewPass = require('@validations/validateNewPass');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function check(token, newpass, confirmnewpass) {
    const errors = [];
    const validtoken = validateNewPass.validateToken(token);
    const validpass = validateNewPass.validatePassword(newpass, confirmnewpass, errors);
    if (errors.length > 0) {
        return errors;
    }

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

    if (check1.data.length >= 1) {
        const expire = new Date(check1.data[0].rtoken_expire);
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
        errors.push({ tokenExpired: 'Token Expirado' });
        return errors;
    }
    errors.push({ invalidToken: 'Token Inválido' });
    return errors;
}

module.exports = { check };
