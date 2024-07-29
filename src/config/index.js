require("dotenv").config();

var environment = {
  port: process.env.PORT,
  host: process.env.HOST,
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgPassword: process.env.PGPASSWORD,
  pgDatabase: process.env.PGDATABASE,
  pgPort: process.env.PGPORT,
};

module.exports = { environment };
