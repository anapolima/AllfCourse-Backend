const query = require('@helpers/Query');

exports.updatephoto = async (req, res) => {
    const userid = req.auth.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: 'Nenhuma foto enviada' });
    } else if (!userid) {
        res.status(400).send({ message: 'Não autorizado' });
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { avatar } = req.files;
        const uploadPath = `${__dirname}/avatars/${avatar.name}-${userid}`;

        // Use the mv() method to place the file somewhere on your server
        try {
            await avatar.mv(uploadPath);
            const whereColumns = {
                id: {
                    operator: '=',
                    value: userid,
                },
            };
            const fieldsValues = {};
            fieldsValues.profile_photo = `http://localhost:3000/static/${avatar.name}-${userid}`;

            const result = await query.Update(
                true,
                'users',
                fieldsValues,
                ['*'],
                whereColumns,
                [''],
            );
            if (Array.isArray(result)) {
                res.status(201).send({ message: 'Foto atualizada com sucesso' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
};
