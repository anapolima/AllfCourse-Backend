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
const { addCourse2 } = require('@controller/courses/addCourse.controller2');
const { getcourse } = require('@controller/courses/getCourse.controller');
const { getclass } = require('@controller/courses/getClassByModule.controller');

// ------------------------------------------------------------//
// -----------------------courses-routes-----------------------//
router.post('/courses', jwtuser, addCourse);
router.post('/addcourse2', jwtuser, addCourse2);
router.get('/getcourse/:id', jwtuser, getcourse);
router.get('/getclass/:moduleid', jwtuser, getclass);
// -----------------------courses-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
