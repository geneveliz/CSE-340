const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

// for add a classification
const classificationNameRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Classification name must contain only letters and spaces."),
  ];
};

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    });
  }
  next();
};

// for add inventory
const addInventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be valid."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_color")
      .trim()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Color must only contain letters."),
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

module.exports = {
  classificationNameRules,
  checkClassificationData,
  addInventoryRules,
  checkInventoryData,
};
