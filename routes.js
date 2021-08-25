process.env.TZ = 'America/Sao_Paulo';
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cookie_parser = require('cookie-parser');

const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie_parser('1234'));

router.get('/test', (req, res) => {
  res.send('test');
});

module.exports = router;
