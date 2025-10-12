const { body } = require("express-validator");
const accountModel = require("../models/account-model");

// Validation rules
const registerRules = [
  body("account_firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  
  body("account_lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) {
        throw new Error("Email exists. Please log in or use a different email.");
      }
    }),

  body("account_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

// Validation for login
const loginRules = [
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email."),
  body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required."),
];

module.exports = {
  registerRules,
  loginRules,
};
