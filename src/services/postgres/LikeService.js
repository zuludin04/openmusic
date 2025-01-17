const { nanoid } = require("nanoid");
const pool = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class LikeService {
  constructor(cacheService) {
    this._cacheService = cacheService;
  }

  async likeAnAlbum(userId, albumId) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, albumId, userId],
    };
    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail to Like an Album");
    }

    await this._cacheService.delete(`albumlikes:${albumId}`);
    return result.rows[0].id;
  }

  async dislikeAnAlbum(albumId, userId) {
    const query = {
      text: `DELETE FROM likes WHERE album_id = $1 AND user_id = $2 RETURNING id`,
      values: [albumId, userId],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Fail to Dislike an Album");
    }

    await this._cacheService.delete(`albumlikes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumlikes:${albumId}`);
      return {
        source: "cache",
        data: result,
      };
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      const query = {
        text: `SELECT COUNT(*) AS total
          FROM likes
          INNER JOIN album ON album.id = likes.album_id`,
        values: [],
      };
      const result = await pool.query(query);
      const total = result.rows[0].total;
      await this._cacheService.set(`albumlikes:${albumId}`, total);
      return {
        source: "db",
        data: total,
      };
    }
  }

  async checkUserAlbumLike(albumId, userId) {
    const query = {
      text: "SELECT * FROM likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };
    const result = await pool.query(query);

    if (result.rowCount == 1) {
      throw new InvariantError("Album Already Liked");
    }
  }
}

module.exports = LikeService;
