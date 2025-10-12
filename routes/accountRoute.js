const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");

// GET views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST for registration
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;

