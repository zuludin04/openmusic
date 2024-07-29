class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistOwnerHandler = this.getPlaylistOwnerHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      data: {
        playlistId: playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistOwnerHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const result = await this._service.getPlaylistByOwner(credentialId);
    return {
      status: "success",
      data: {
        playlists: result,
      },
    };
  }

  async deletePlaylistHandler(request) {
    this._validator.validateDeletePlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    // await this._service.deletePlaylist(playlistId, credentialId);

    return {
      status: "success",
      message: "Playlist is delete successfully",
    };
  }
}

module.exports = PlaylistHandler;
