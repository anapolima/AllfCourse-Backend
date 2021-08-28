// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'courses' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { addCourse } = require('@controller/courses/addCourse.controller');
const { addCourse2 } = require('@controller/courses/addCourse.controller2');
const auth = require('@middlewares/auth');
const { getcourse } = require('@controller/courses/getCourse.controller');
const { getclass } = require('@controller/courses/getClassByModule.controller');

// ------------------------------------------------------------//
// -----------------------courses-routes-----------------------//
router.post('/courses', addCourse);
router.post('/addcourse2', auth, addCourse2);
router.get('/getcourse/:id', getcourse);
router.get('/getclass/:moduleid', getclass);
// -----------------------courses-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
