class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
      playlistId: request.params.id,
    };

    await this._playlistService.verifyPlaylistOwner(
      message.playlistId,
      message.userId
    );
    await this._service.sendMessage("export:playlist", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Your request in Queue",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
