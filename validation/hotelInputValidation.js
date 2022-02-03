const Joi = require("@hapi/joi");

const addHotelValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    place: Joi.string().min(6).required(),
    stars: Joi.number().min(1).max(5).required(),
  });
  return schema.validate(data);
};

module.exports = { addHotelValidation: addHotelValidation };
