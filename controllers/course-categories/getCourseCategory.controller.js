// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'login' function of the 'session' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getcategory = async (req, res) => {
    const { id } = req.params;
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        if (id === '0') {
            const checkSelect = ['*'];
            const categoryFound = await query.Select(
                'courses_categories',
                checkSelect,
                [''],
                [''],
            );
            if (categoryFound.data.length < 1) {
                res.status(404).send({ message: 'Nenhuma categoria encontrada' });
            } else {
                res.status(200).send(categoryFound.data);
            }
        } else {
            const checkSelect = ['*'];
            const whereCheck = {
                id: {
                    operator: '=',
                    value: id,
                },
            };
            const categoryFound = await query.Select(
                'courses_categories',
                checkSelect,
                whereCheck,
                [''],
            );
            if (categoryFound.data.length < 1) {
                res.status(404).send({ message: 'Nenhuma categoria com este ID encontrado' });
            } else {
                res.status(200).send(categoryFound.data);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
