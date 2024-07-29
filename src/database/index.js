const { Pool } = require("pg");
const { environment } = require("../config");

const pool = new Pool({
  user: environment.pgUser,
  host: environment.pgHost,
  database: environment.pgDatabase,
  password: environment.pgPassword,
  port: environment.pgPort,
});

module.exports = pool;
