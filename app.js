// -----------------------------------------------------------------------------------------------//
// Archive: app.js
// Description: File responsible for configuring the application (Back-End)
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();

process.env.TZ = 'America/Sao_Paulo';
require('module-alias/register');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const compression = require('compression');
const cookie_parser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rateLimit = require('@middlewares/rateLimit');
const sendError = require('@helpers/sendError');
const routes = require('./routes/index.routes');

const dateoptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo',
};

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, './logs/requests.log'),
    { flags: 'a' },
);

app.use(sendError);
app.use('/static', express.static(`${__dirname}/avatars`));
app.use(fileUpload());
app.use(
    morgan(
        `:method :url :response-time ms\nDATE: ${new Date().toLocaleDateString(
            'en-US',
            dateoptions,
        )}\nHTTP STATUS CODE: :status\n`,
        { stream: accessLogStream },
    ),
);
app.use(compression());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.front_port}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.use(cookie_parser('1234')); // force to sign the cookie
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(...rateLimit);
app.use(helmet());

app.disable('x-powered-by');

app.use(routes); // => require all routes created on index.routes.js

// ----------------------------------------------------------------------------//
// ---------------Middleware route to serve the home page----------------------//
// app.use(express.static(path.join(__dirname, "../../front/", "build")));
// app.use(express.static('public'));
// ---------------Middleware route to serve the home page----------------------//
// ----------------------------------------------------------------------------//
module.exports = app;
