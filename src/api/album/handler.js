class AlbumHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
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
    const fileLocation = `/upload/images/${filename}`;

    await this._service.updateAlbumCover(albumId, fileLocation);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
