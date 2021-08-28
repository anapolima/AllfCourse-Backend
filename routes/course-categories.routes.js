// -----------------------------------------------------------------------------------------------//
// Archive: routes/course-categories.routes.js
// Description: File responsible for api routes related to 'course categories' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { addCourseCategory } = require('@controller/course-categories/addCourseCategory.controller');

// ------------------------------------------------------------//
// ------------------course-categories-routes------------------//
router.post('/courses-categories', addCourseCategory);
// ------------------course-categories-routes------------------//
// ------------------------------------------------------------//

module.exports = router;
