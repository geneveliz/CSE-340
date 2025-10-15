const { body } = require('express-validator');
const accountModel = require('../models/account-model');

// Registered
const emailValidation = body('account_email')
  .trim()
  .isEmail()
  .withMessage('A valid email is required.')
  .normalizeEmail()
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      throw new Error('Email exists. Please log in or use a different email.');
    }
    return true;
  });

// Validation account update
const updateAccountValidation = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required.'),
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),
];

// Validation password
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

module.exports = {
  emailValidation,
  updateAccountValidation,
  passwordValidation,
};
