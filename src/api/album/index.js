const AlbumHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (
    server,
    { service, storageService, likeService, validator }
  ) => {
    const albumHandler = new AlbumHandler(
      service,
      storageService,
      likeService,
      validator
    );
    server.route(routes(albumHandler));
  },
};
