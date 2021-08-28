// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'courses' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { addCourse } = require('@controller/courses/addCourse.controller');

// ------------------------------------------------------------//
// -----------------------courses-routes-----------------------//
router.post('/courses', addCourse);
// -----------------------courses-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
