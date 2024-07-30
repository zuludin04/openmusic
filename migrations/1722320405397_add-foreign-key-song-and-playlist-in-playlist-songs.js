/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_id_playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.song_id_song.id",
    "FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_id_playlist.id"
  );
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs.song_id_song.id");
};
