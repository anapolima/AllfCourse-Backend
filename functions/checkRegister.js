const query = require('@helpers/Query');
require('dotenv').config();

async function check(document, email, phone) {
    const checkSelect1 = ['document'];
    const checkSelect2 = ['email'];
    const checkSelect3 = ['phone'];
    const whereCheck1 = {
        document: {
            operator: '=',
            value: document,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck2 = {
        email: {
            operator: '=',
            value: email,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck3 = {
        phone: {
            operator: '=',
            value: parseInt(phone, 2),
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const checkOperators = ['AND'];
    const check1 = await query.Select(
        'users',
        checkSelect1,
        whereCheck1,
        checkOperators,
    );

    const check2 = await query.Select(
        'users',
        checkSelect2,
        whereCheck2,
        checkOperators,
    );

    const check3 = await query.Select(
        'users',
        checkSelect3,
        whereCheck3,
        checkOperators,
    );
    if (
        Array.isArray(check1.data)
        || Array.isArray(check2.data)
        || Array.isArray(check3.data)
    ) {
        if (check1.data.length >= 1) {
            if (check2.data.length >= 1) {
                return ['Documento e email já existem', 500];
            } if (check3.data.length >= 1) {
                return ['Documento e telefone já existem', 500];
            }
            return ['Documento já existe', 500];
        } if (check2.data.length >= 1) {
            if (check3.data.length >= 1) {
                return ['Email e telefone já existem', 500];
            }
            return ['Email já existe', 500];
        } if (check3.data.length >= 1) {
            return ['Telefone já existe', 500];
        }
        return true;
    }

    return [check1, 500];
}

module.exports = { check };
