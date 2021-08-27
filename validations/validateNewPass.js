module.exports = {
    validateToken: (token, _errors) => {
        if (typeof (token) === 'string') {
            return true;
        }
        _errors.push({ tokenString: 'O Token deve ser uma string' });
        return false;
    },
    validatePassword: (_password, _passwordagain, _errors) => {
        if (typeof (_password) === 'string') {
            if (_password.length >= 6) {
                if (_password === _passwordagain) {
                    return true;
                }
                _errors.push({ passwordMatch: 'Senhas não conferem' });
                return false;
            }

            _errors.push({ passwordLength: 'A senha deve possuir no mínimo 6 caracteres' });
            return false;
        }

        _errors.push({ passwordString: 'A senha deve ser em formato string' });
        return false;
    },
};
