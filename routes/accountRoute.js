const express = require("express");
const router = express.Router();

const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const validator = require("../validation/account-validation"); 

/* ========================
 * Account Routes
 ======================== */

// GET 
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/logout", accountController.logoutAccount);

// Dashboard 
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

// POST 
router.post("/register", validator.emailValidation, utilities.handleErrors(accountController.registerAccount));
router.post("/login", utilities.handleErrors(accountController.loginAccount));
router.post("/update-info", validator.updateAccountValidation, utilities.handleErrors(accountController.updateAccountInfo));
router.post("/update-password", validator.passwordValidation, utilities.handleErrors(accountController.updatePassword));

module.exports = router;

