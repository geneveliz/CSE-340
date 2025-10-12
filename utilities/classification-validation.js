
//requier validation 
const { body, validationResult } = require('express-validator');

const validateClassification = [
  body('classification_name')
    .trim()
    .isLength({ min: 3 }).withMessage('Classification must be at least 3 characters')
    .matches(/^[A-Za-z0-9]+$/).withMessage('No spaces or special characters allowed'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('inventory/add-classification', {
        title: 'Add Classification',
        errors: errors.array().map(e => e.msg),
        classification_name: req.body.classification_name,
        message: null,
      });
    }vehicleList
    next();
  }
];

module.exports = { validateClassification };




