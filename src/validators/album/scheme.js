const Joi = require("joi");

const AlbumPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const AlbumCoverHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp"
    )
    .required(),
}).unknown();

module.exports = { AlbumPayloadScheme, AlbumCoverHeadersSchema };
