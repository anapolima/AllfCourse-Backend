process.env.TZ = 'America/Sao_Paulo';
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const jwtuser = require('@middlewares/auth');
const cookie_parser = require('cookie-parser');

const app = express();
const router = express.Router();

const register = require('@controller/users/register.controller');
const validateaccount = require('@controller/users/validAccount.controller');
const newemailtoken = require('@controller/users/newEmailToken.controller');
const login = require('@controller/login/login.controller');
const logout = require('@controller/login/logout.controller');
const forgotpassemail = require('@controller/recover/forgotPassEmail.controller');
const forgotpasssms = require('@controller/recover/forgotPassSMS.controller');
const resetpass = require('@controller/recover/resetPass.controller');
const addCourseCategory = require('@controller/course-categories/addCourseCategory.controller');
const addCourse = require('@controller/courses/addCourse.controller');
const addCourseFlag = require('@controller/courses/addCourseFlag.controller');
const addModule = require('@controller/course-modules/addModule.controller');
const addClass = require('@controller/course-classes/addClass.controller');
const addPaymentMethod = require('@controller/payment-method/addPaymentMethod.controller');
const addSale = require('@controller/sales/addSale.controller');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie_parser('1234'));

router.get('/test', (req, res) => {
    res.send('test');
});

router.post('/register', register.post);
router.post('/validate', validateaccount.post);
router.post('/newvalidate', newemailtoken.post);
router.post('/logout', logout.post);
router.post('/requestpass_email', forgotpassemail.post);
router.post('/requestpass_sms', forgotpasssms.post);
router.post('/resetpass', resetpass.post);
router.post('/courses-categories', addCourseCategory.post);
router.post('/courses', addCourse.post);
router.post('/modules', addModule.post);
router.post('/course-flag', addCourseFlag.post);
router.post('/classes', addClass.post);
router.post('/payment-methods', addPaymentMethod.post);
router.post('/buy', jwtuser, addSale.post);
router.get('/login', login.get);

module.exports = router;
