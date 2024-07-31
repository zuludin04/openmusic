class AlbumHandler {
  constructor(service, storageService, likeService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._likeService = likeService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
    this.postDislikeAlbumHandler = this.postDislikeAlbumHandler.bind(this);
    this.getTotalAlbumLikesHandler = this.getTotalAlbumLikesHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      data: {
        albumId: albumId,
      },
    });

    response.code(201);
    return response;
  }

  // eslint-disable-next-line no-unused-vars
  async getAlbumByIdHandler(request, _) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async putAlbumByIdHandler(request, _) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Success update Album",
    };
  }

  // eslint-disable-next-line no-unused-vars
  async deleteAlbumByIdHandler(request, _) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album is delete successfully",
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const { id: albumId } = request.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/covers/${filename}`;

    await this._service.updateAlbumCover(albumId, fileLocation);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAlbumExistence(albumId);
    await this._likeService.checkUserAlbumLike(albumId, credentialId);
    await this._likeService.likeAnAlbum(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "You Like this Album",
    });

    response.code(201);
    return response;
  }

  async postDislikeAlbumHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._likeService.dislikeAnAlbum(id, credentialId);

    return {
      status: "success",
      message: "You Dislike this Album",
    };
  }

  async getTotalAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const result = await this._likeService.getAlbumLikes(albumId);
    console.log(result);

    const response = h.response({
      status: "success",
      data: {
        likes: parseInt(result.data),
      },
    });
    if (result.source == "cache") {
      response.header("X-Data-Source", "cache");
    }
    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;
