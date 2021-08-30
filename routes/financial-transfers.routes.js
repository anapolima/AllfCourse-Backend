// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'courses' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const { getFinancialTransfers } = require('@controller/financial-transfers/getFinancialTransfers.controller');

const router = express.Router();
// ------------------------------------------------------------//
// -----------------------financial-transfers-routes-----------------------//
router.get('/financial-transfers/teacher/:id', jwtuser, getFinancialTransfers); // todos

// -----------------------financial-transfers-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
