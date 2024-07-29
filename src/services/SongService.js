const { nanoid } = require("nanoid");
const pool = require("../database");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class SongService {
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail to save song");
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await pool.query("SELECT id, title, performer FROM song");
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM song WHERE id = $1`,
      values: [id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: `UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail to update Song");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail delete Song");
    }
  }
}

module.exports = SongService;
