require('dotenv').config();
require('module-alias/register');

const { Pool } = require('pg');
const config = require('@config');

const sqlpool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
  ssl: { rejectUnauthorized: false },
});

module.exports = { sqlpool }
