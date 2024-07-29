const pool = require("../database");
const InvariantError = require("../exceptions/InvariantError");

class AuthenticationService {
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh Token Invalid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };
    await pool.query(query);
  }
}

module.exports = AuthenticationService;
