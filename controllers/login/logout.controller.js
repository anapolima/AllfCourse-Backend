module.exports = {
    post: (req, res) => {
        res.status(202).clearCookie('usertoken').send({ message: 'Logout sucedido' });
    },
};
