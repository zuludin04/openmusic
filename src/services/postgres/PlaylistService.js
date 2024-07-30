const { nanoid } = require("nanoid");
const pool = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  async addPlaylist({ name, owner }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO playlist VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };
    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail to save Playlist");
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlist WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist Not Found");
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("You have no right to access this resource");
    }
  }

  async getPlaylistByOwner(owner) {
    const query = {
      text: "SELECT id, name, owner as username FROM playlist WHERE owner = $1",
      values: [owner],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async deletePlaylist(playlistId, userId) {
    const query = {
      text: "DELETE FROM playlist WHERE id = $1 AND owner = $2 RETURNING id",
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Fail to delete Playlist");
    }
  }
}

module.exports = PlaylistService;
