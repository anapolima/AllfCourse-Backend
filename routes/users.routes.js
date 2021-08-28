// -----------------------------------------------------------------------------------------------//
// Archive: routes/users.routes.js
// Description: File responsible for api routes related to 'users' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { addUser } = require('@controller/users/register.controller');
const { validateAccount } = require('@controller/users/validAccount.controller');
const { getuser } = require('@controller/users/getusers.controller');
const { getstudent } = require('@controller/users/getEnrollStudentsController');

// ------------------------------------------------------------//
// -------------------------users-routes-----------------------//
router.post('/register', addUser);
router.post('/validate', validateAccount);
router.get('/user/:id', getuser);
router.get('/getstudent/:courseid', getstudent);
// -------------------------users-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
