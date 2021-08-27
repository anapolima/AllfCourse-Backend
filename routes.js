process.env.TZ = 'America/Sao_Paulo';
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const jwtuser = require('@middlewares/auth');
const cookie_parser = require('cookie-parser');

const app = express();
const router = express.Router();

const register = require('@controller/registerController');
const validateaccount = require('@controller/validAccountController');
const newemailtoken = require('@controller/newEmailTokenController');
const login = require('@controller/loginController');
const logout = require('@controller/logoutController');
const forgotpassemail = require('@controller/forgotPassEmailController');
const forgotpasssms = require('@controller/forgotPassSMSController');
const resetpass = require('@controller/resetPassController');
const addCourseCategory = require('@controller/addCourseCategory');
const addCourse = require('@controller/addCourse');
const addCourseFlag = require('@controller/addCourseFlag');
const addModule = require('@controller/addModule');
const addClass = require('@controller/addClass');
const addPaymentMethod = require('@controller/addPaymentMethod');
const addSale = require('@controller/addSale');

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
