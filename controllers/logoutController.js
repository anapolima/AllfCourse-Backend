module.exports = {
    post: (req, res) => {
        res.status(202).clearCookie('usertoken').send('Logout sucedido');
    },
};
