/* eslint-disable no-unused-vars */
const query = require('@helpers/Query');
const validateRegister = require('@validations/validateRegister');
require('dotenv').config();

async function check(document, email, phone, firstname, lastname, gender, birthdate) {
    console.log(birthdate);
    const errors = [];
    const validDocument = validateRegister.validateDocument(
        document,
        errors,
    );
    const validEmail = validateRegister.validateEmail(email, errors);
    const validFirstName = validateRegister.validateFirstName(
        firstname,
        errors,
    );
    const validLastName = validateRegister.validateLastName(
        lastname,
        errors,
    );
    const validGender = validateRegister.validateGender(gender, errors);
    const validPhone = validateRegister.validatePhone(phone, errors);
    const validbirthDate = validateRegister.validateBirthDate(birthdate, errors);
    if (errors.length > 0) {
        return errors;
    }

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
                errors.push({ 'document/email': 'Documento e e-mail já existem' });
                return errors;
            } if (check3.data.length >= 1) {
                errors.push({ 'document/phone': 'Documento e telefone já existem' });
                return errors;
            }
            errors.push({ document: 'Documento já existe' });
            return errors;
        } if (check2.data.length >= 1) {
            if (check3.data.length >= 1) {
                errors.push({ 'email/phone': 'Email e telefone já existem' });
                return errors;
            }
            errors.push({ email: 'Email já existe' });
            return errors;
        } if (check3.data.length >= 1) {
            errors.push({ phone: 'Telefone já existe' });
            return errors;
        }
        return true;
    }

    return [check1, 500];
}

module.exports = { check };
