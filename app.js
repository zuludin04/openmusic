const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const album = require("./src/api/album");
const song = require("./src/api/song");
const { environment } = require("./src/config");
const AlbumService = require("./src/services/postgres/AlbumService");
const SongService = require("./src/services/postgres/SongService");
const AlbumValidator = require("./src/validators/album");
const SongValidator = require("./src/validators/song");
const ClientError = require("./src/exceptions/ClientError");
const UserService = require("./src/services/postgres/UserService");
const user = require("./src/api/user");
const UsersValidator = require("./src/validators/user");
const AuthenticationService = require("./src/services/postgres/AuthenticationService");
const authentication = require("./src/api/authentication");
const TokenManager = require("./src/tokenize/TokenManager");
const AuthenticationsValidator = require("./src/validators/authentications");
const playlist = require("./src/api/playlist");
const PlaylistService = require("./src/services/postgres/PlaylistService");
const PlaylistValidator = require("./src/validators/playlist");
const playlist_song = require("./src/api/playlist_song");
const PlaylistSongService = require("./src/services/postgres/PlaylistSongService");
const PlaylistSongValidator = require("./src/validators/playlist_song");
const _exports = require("./src/api/export");
const ProducerService = require("./src/services/rabitmq/ProducerService");
const ExportValidator = require("./src/validators/export");
const StorageService = require("./src/services/storage/StorageService");
const path = require("path");
const Inert = require("@hapi/inert");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const storageService = new StorageService(
    path.resolve(__dirname, "src/api/album/file/covers")
  );

  const server = Hapi.server({
    port: environment.port,
    host: environment.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        storageService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlist_song,
      options: {
        playlistSongService,
        playlistService,
        songService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService,
        validator: ExportValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();

  console.log(`Server running on ${server.info.uri}`);
};

init();
