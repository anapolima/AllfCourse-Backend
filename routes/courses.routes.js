// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'courses' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addCourse } = require('@controller/courses/addCourse.controller');
const { getcourse } = require('@controller/courses/getCourse.controller');
const { getclass } = require('@controller/courses/getClassByModule.controller');
const { deletecourse } = require('@controller/courses/deleteCourse.controller');
const { deletecoursemodule } = require('@controller/courses/deleteCourseModule.controller');
const { validateCourse } = require('@controller/courses/validateCourse.controller');

// ------------------------------------------------------------//
// -----------------------courses-routes-----------------------//
router.post('/addcourse', jwtuser, addCourse); // professor
router.get('/getcourse/:id', jwtuser, getcourse); // todos
router.get('/getclass/:moduleid', jwtuser, getclass); // todos
router.delete('/deletecourse/:id', jwtuser, deletecourse);
router.delete('/deletemodule/:id', jwtuser, deletecoursemodule);
router.put('/validatecourse', jwtuser, validateCourse);
// -----------------------courses-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
