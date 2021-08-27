const query = require('@helpers/Query');

const checkAddBuy = require('@functions/checkAddBuy');

module.exports = {
    post: async (req, res) => {
        const { courseid } = req.body;
        const { stundentid } = req.body;
        const { paymentmethodid } = req.body;
        const { price } = req.body;

        const check = await checkAddBuy.check(courseid, stundentid, price, paymentmethodid);

        if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const columns = {
                name: check.name,
                teacher_id: check.teacherid,
                price: check.price,
                description: check.description,
                status: 'em análise',
                created_by: 45,
            };
            const returningColumns = ['*'];

            const result = await query.Insert(
                'courses',
                columns,
                returningColumns,
            );

            if (Array.isArray(result.data)) {
                res.status(201).send({ message: 'Curso adicionado com sucesso!' });
            } else {
                res.sendError(result.error, 500);
            }
        }
    },
};
