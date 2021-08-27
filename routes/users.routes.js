// -----------------------------------------------------------------------------------------------//
// Archive: routes/usersRoute.js
// Description: File responsible for api routes related to 'users' class
// Data: 2021/08/17
// Author: Reinan/Juliana
// ----------------------------------------------------------------------------------------------//

const router = require('express-promise-router')();
const addUser = require('@controller/users/register.controller');
const auth = require('./auth');

// -----------------------------------------------------------//
// -----------------------------------users-------------------//
router.post('/users', auth, addUser);
// router.put('/users/:id', auth, updateUser);
// router.delete('/users/:id', auth, deleteUser);
// -----------------------------------users--------------------//
// ------------------------------------------------------------//
module.exports = router;
