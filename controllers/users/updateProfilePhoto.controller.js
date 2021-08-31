exports.updatephoto = (req, res) => {
    const userid = req.auth.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({ message: 'Nenhuma foto enviada' });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const { avatar } = req.files;
    const uploadPath = `${__dirname}/avatars/${avatar.name}-${userid}`;

    // Use the mv() method to place the file somewhere on your server
    avatar.mv(uploadPath, (err) => {
        if (err) { return res.status(500).send(err); }

        res.status(201).send({ message: 'Foto enviada com sucesso' });
    });
};
