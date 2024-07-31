const { nanoid } = require("nanoid");
const pool = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class LikeService {
  async likeAnAlbum(userId, albumId) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };
    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail to Like an Album");
    }

    return result.rows[0].id;
  }

  async dislikeAnAlbum(albumId, userId) {
    const query = {
      text: `DELETE FROM likes WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail to Dislike an Album");
    }
  }

  async getAlbumLikes() {
    const query = {
      text: `SELECT COUNT(*) AS total
        FROM likes
        INNER JOIN album ON album.id = likes.album_id`,
      values: [playlistId],
    };
    const result = await pool.query(query);
    return result.rows[0].total;
  }
}

module.exports = LikeService;
