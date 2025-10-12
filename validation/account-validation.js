//this is the validation for accounts 

const { body } = require('express-validator');
const accountModel = require('../models/account-model'); 

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

module.exports = {
  emailValidation,
};

