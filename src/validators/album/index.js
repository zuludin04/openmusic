const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadScheme, AlbumCoverHeadersSchema } = require("./scheme");

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumCoverHeaders: (headers) => {
    const validationResult = AlbumCoverHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
