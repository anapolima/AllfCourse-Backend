// -----------------------------------------------------------------------------------------------//
// Archive: routes/sales.routes.js
// Description: File responsible for api routes related to 'sales' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { addSale } = require('@controller/sales/addSale.controller');

// ------------------------------------------------------------//
// -------------------------sales-routes-----------------------//
router.post('/buy', addSale);
// -------------------------sales-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
