// -----------------------------------------------------------------------------------------------//
// Archive: routes/sales.routes.js
// Description: File responsible for api routes related to 'sales' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addSale } = require('@controller/sales/addSale.controller');
const { getSales } = require('@app/controllers/sales/getSalesByCourseId.controller');

// ------------------------------------------------------------//
// -------------------------sales-routes-----------------------//
router.post('/buy', jwtuser, addSale); // aluno, professor
router.get('/sales/course/:id', jwtuser, getSales);
// -------------------------sales-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
