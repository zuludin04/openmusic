const { nanoid } = require("nanoid");
const pool = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO album VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail to save album");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await pool.query("SELECT * FROM album");
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM album WHERE id = $1`,
      values: [id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album not found");
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail to update Album");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM album WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail delete Album");
    }
  }
}

module.exports = AlbumService;
