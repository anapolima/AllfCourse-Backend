// -----------------------------------------------------------------------------------------------//
// Archive: routes/course-categories.routes.js
// Description: File responsible for api routes related to 'course categories' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addCourseCategory } = require('@controller/course-categories/addCourseCategory.controller');
const { getcategory } = require('@controller/course-categories/getCourseCategory.controller');

// ------------------------------------------------------------//
// ------------------course-categories-routes------------------//
router.post('/courses-categories', jwtuser, addCourseCategory);
router.get('/category/:id', jwtuser, getcategory);
// ------------------course-categories-routes------------------//
// ------------------------------------------------------------//

module.exports = router;
