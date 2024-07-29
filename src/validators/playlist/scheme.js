const Joi = require("joi");

const PlaylistPayloadScheme = Joi.object({
  name: Joi.string().required(),
});

const DeletePlaylistPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
});

module.exports = { PlaylistPayloadScheme, DeletePlaylistPayloadSchema };
