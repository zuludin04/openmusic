const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const album = require("./src/api/album");
const song = require("./src/api/song");
const { environment } = require("./src/config");
const AlbumService = require("./src/services/AlbumService");
const SongService = require("./src/services/SongService");
const AlbumValidator = require("./src/validators/album");
const SongValidator = require("./src/validators/song");
const ClientError = require("./src/exceptions/ClientError");
const UserService = require("./src/services/UserService");
const user = require("./src/api/user");
const UsersValidator = require("./src/validators/user");
const AuthenticationService = require("./src/services/AuthenticationService");
const authentication = require("./src/api/authentication");
const TokenManager = require("./src/tokenize/TokenManager");
const AuthenticationsValidator = require("./src/validators/authentications");
const playlist = require("./src/api/playlist");
const PlaylistService = require("./src/services/PlaylistService");
const PlaylistValidator = require("./src/validators/playlist");
const playlist_song = require("./src/api/playlist_song");
const PlaylistSongService = require("./src/services/PlaylistSongService");
const PlaylistSongValidator = require("./src/validators/playlist_song");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();

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
