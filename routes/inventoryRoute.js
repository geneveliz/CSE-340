//inventory Routes 
const express = require('express');
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities');
const invValidation = require('../validation/inventory-validation');

// Management View
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Classification ((GET))
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

// Classification (POST)
router.post(
  '/add-classification',
  invValidation.classificationNameRules,
  utilities.handleErrors(invController.addClassification)
);

// Inventory ((GET))
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.get('/inventory/detail/:invId', invController.buildByInvId);

// Inventory (POST)
router.post(
  '/add-inventory',
  invValidation.addInventoryRules,
  utilities.handleErrors(invController.addInventory)
);

// Inventory by classification ((GET))
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// Vehicle detail ((GET))
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId));

//  fallback route 
router.get('/type', utilities.handleErrors(invController.buildByClassificationId));

// Error handler 
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', {
    title: 'Server Error',
    message: err.message
  });
});

module.exports = router;



