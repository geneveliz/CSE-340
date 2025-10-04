// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/index") // for handleErrors

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

// NEW: Route to show a single vehicle detail view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId));

module.exports = router;
