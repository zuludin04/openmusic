const { nanoid } = require("nanoid");
const pool = require("../../database");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongService {
  async addSongIntoPlaylist({ playlistId, songId }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Fail add Song into Playlist");
    }

    return result.rows[0].id;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Fail delete Song From Playlist");
    }
  }

  async verifySongInPlaylist(playlistId, songId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Fail to Verify Song In Playlist");
    }
  }

  async getSongFromPlaylist(playlistId) {
    const query = {
      text: `SELECT playlist.id as playlistId, playlist.name, users.username, song.id as songId, song.title, song.performer
        FROM playlist_songs
        INNER JOIN playlist ON playlist.id = playlist_songs.playlist_id
        INNER JOIN song ON song.id = playlist_songs.song_id
        INNER JOIN users ON users.id = playlist.owner
        WHERE playlist_songs.playlist_id=$1`,
      values: [playlistId],
    };
    const result = await pool.query(query);
    let songs = [];
    let id = "";
    let name = "";
    let username = "";

    result.rows.forEach((value) => {
      songs.push({
        id: value.songid,
        title: value.title,
        performer: value.performer,
      });
      if (id == "") {
        id = value.playlistid;
        name = value.name;
        username = value.username;
      }
    });

    return {
      id: id,
      name: name,
      username: username,
      songs: songs,
    };
  }
}

module.exports = PlaylistSongService;
