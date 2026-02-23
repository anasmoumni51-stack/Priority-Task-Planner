const joi = require('joi');

function validateUser(user) {
  const schema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(5).max(255).required()
  });
  
  return schema.validate(user);
}

module.exports = validateUser;