// Inventory validation

const { body, validationResult } = require('express-validator');

const validateInventory = [
  body('classification_id').notEmpty().withMessage('Classification is required'),
  body('inv_make').trim().isLength({ min: 2 }).withMessage('Make is required'),
  body('inv_model').trim().isLength({ min: 2 }).withMessage('Model is required'),
  body('inv_description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('inv_price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('inv_year').isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid 4-digit number'),
  body('inv_color').optional({ checkFalsy: true }).isAlpha().withMessage('Color must only contain letters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const classificationList = Util.buildClassificationList(req.body.classification_id);
      classificationList.then(list => {
        res.status(400).render('inventory/add-inventory', {
          title: 'Add Vehicle',
          classificationList: list,
          errors: errors.array().map(e => e.msg),
          message: null,
          ...req.body,
        });
      });
      return;
    }
    next();
  }
];

module.exports = { validateInventory };
