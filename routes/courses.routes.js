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
const { getCoursesInFlags } = require('@app/controllers/courses/getCoursesInFlag.controller');
const { getModulesByCourse } = require('@app/controllers/courses/getCourseModules.controller');
const { getCoursesByLoggedTeacher } = require('@app/controllers/courses/getCoursesByLoggedTeacher.controller');
const { getCoursesByLoggedUser } = require('@app/controllers/courses/getCoursesByLoggedUser.controller');
const { deleteCourseFlag } = require('@app/controllers/courses/deleteCourseFlag.controller');
const { getCourseInformations } = require('@app/controllers/courses/getCourseInformations.controller');
const { updateCourse } = require('@controller/courses/updateCourse.controller');
const { updateModule } = require('@controller/courses/updateModule.controller');
const { updatecoursephoto } = require('@controller/courses/updateCoursePhoto.controller');
const addModuleController = require('@controller/courses/addModule.controller');
const addClassController = require('@controller/courses/addClass.controller');
// ------------------------------------------------------------//
// -----------------------courses-routes-----------------------//
router.post('/addcourse', jwtuser, addCourse); // professor
router.post('/addmodule', jwtuser, addModuleController);
router.post('/addclass', jwtuser, addClassController);
router.get('/getcourse/:id', jwtuser, getcourse); // todos
router.get('/getclass/:moduleId', jwtuser, getclass); // todos
router.get('/courses/flag/:id', jwtuser, getCoursesInFlags); // retorna todos os cursos em uma determinada categoria (passar o id da categoria), se 0 retorna todos os cursos de todas as categorias
router.get('/modules/course/:id', jwtuser, getModulesByCourse);
router.delete('/deletecourse/:id', jwtuser, deletecourse);
router.delete('/deletemodule/:id', jwtuser, deletecoursemodule);
router.put('/validatecourse', jwtuser, validateCourse);
router.get('/courses/logged-teacher', jwtuser, getCoursesByLoggedTeacher);
router.get('/courses/logged-user', jwtuser, getCoursesByLoggedUser);
router.delete('/course-flag/:courseId/:categoryId', jwtuser, deleteCourseFlag);
router.get('/course-informations/:courseId', jwtuser, getCourseInformations);
router.put('/updatecourse/:id', jwtuser, updateCourse);
router.put('/updatemodule/:id', jwtuser, updateModule);
router.put('/updatecoursebanner/:id', jwtuser, updatecoursephoto);
// -----------------------courses-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
