// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'login' function of the 'session' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getclass = async (req, res) => {
    const { moduleid } = req.params;
    if (moduleid === '0') {
        const checkSelect = ['*'];
        const classFound = await query.Select(
            'classes',
            checkSelect,
            [''],
            [''],
        );
        if (classFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhuma aula encontrada' });
        } else {
            res.status(200).send(classFound.data);
        }
    } else {
        const checkSelect = ['*'];
        const whereCheck = {
            module_id: {
                operator: '=',
                value: moduleid,
            },
        };
        const classFound = await query.Select(
            'classes',
            checkSelect,
            whereCheck,
            [''],
        );
        if (classFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhuma aula neste modulo com este ID encontrada' });
        } else {
            res.status(200).send(classFound.data);
        }
    }
};
