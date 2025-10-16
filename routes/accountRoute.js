

const express = require("express");
const router = express.Router();

const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const validator = require("../validation/account-validation"); 

/* ========================
 * the Routes
 ======================== */

// GET views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/logout", accountController.logoutAccount);

// Dashboard to manage account 
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

// POST actions
router.post("/register", validator.emailValidation, utilities.handleErrors(accountController.registerAccount));
router.post("/login", utilities.handleErrors(accountController.loginAccount));
router.post("/update-info", validator.updateAccountValidation, utilities.handleErrors(accountController.updateAccountInfo));
router.post("/update-password", validator.passwordValidation, utilities.handleErrors(accountController.updatePassword));

router.get('/update/:id', utilities.handleErrors(accountController.getUpdateView));

router.get("/update-info", utilities.handleErrors(accountController.buildUpdateInfo));
router.get("/update-password", utilities.handleErrors(accountController.buildUpdatePassword));
router.get('/account/password', utilities.handleErrors(accountController.buildPasswordUpdateForm));

const checkAdmin = require('../middleware/requireAuth');

router.get('/update-info/:id', utilities.handleErrors(accountController.getUpdateView)); 
router.post('/update-info', validator.updateAccountValidation, utilities.handleErrors(accountController.updateAccountInfo));

router.get('/update-password/:id', utilities.handleErrors(accountController.buildPasswordUpdateForm));
router.post('/update-password', validator.passwordValidation, utilities.handleErrors(accountController.updatePassword));
router.get('/update-password/:id', accountController.buildPasswordUpdateForm);


module.exports = router;

