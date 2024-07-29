class PlaylistSongHandler {
  constructor(playlistSongService, playlistService, songService, validator) {
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;

    this.postSongIntoPlaylistHandler =
      this.postSongIntoPlaylistHandler.bind(this);
    this.getSongFromPlaylistHandler =
      this.getSongFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongIntoPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._songService.getSongById(songId);
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongId = await this._playlistSongService.addSongIntoPlaylist({
      playlistId,
      songId,
    });

    const response = h.response({
      status: "success",
      message: "Success Add Song To Playlist",
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._playlistSongService.getSongFromPlaylist(
      playlistId
    );

    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistSongService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: "success",
      message: "Success Delete Song From Playlist",
    };
  }
}

module.exports = PlaylistSongHandler;
