const Joi = require("joi");

const ExportPlaylistPayloadScheme = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistPayloadScheme;
