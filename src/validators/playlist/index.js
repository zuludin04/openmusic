const InvariantError = require("../../exceptions/InvariantError");
const {
  PlaylistPayloadScheme,
  DeletePlaylistPayloadSchema,
} = require("./scheme");

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePlaylistPayload: (payload) => {
    const validationResult = DeletePlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
