const { body, param, validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  console.log('middleware')
  next();
};

const registerValidationRules = [
  body("name")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30"),
  body("username")
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 6, max: 25 })
    .withMessage("Username must be between 6 and 25 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 6 }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 to 25 characters"),
  validateResult,
];

const loginValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 6 }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 to 25 characters"),
  validateResult,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
};
