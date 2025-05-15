const Joi = require("joi");

const createUserValid = Joi.object({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number/special character and be at least 8 characters long",
      "string.empty": "Password is required",
    }),
  confirmpass: Joi.any().valid(Joi.ref("password")).required(),
}).messages({
  "any.only": "Password and confirm password must match",
});

module.exports = { createUserValid };
