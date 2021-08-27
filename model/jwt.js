const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET

exports.sign = payload => jwt.sign(payload, secret, { expiresIn: '1d' })
exports.verify = token => jwt.verify(token, secret)


