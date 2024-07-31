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
    "likes",
    "fk_likes.album_id_album.id",
    "FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "likes",
    "fk_likes.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("song", "fk_likes.album_id_album.id");
  pgm.dropConstraint("song", "fk_likes.user_id_users.id");
};
