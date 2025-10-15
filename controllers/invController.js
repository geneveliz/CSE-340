const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");


// Admin view
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      message: req.flash("message") || null,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

// View buildByClassificationId
async function buildByClassificationId(req, res) {
  const classificationId = parseInt(req.params.classificationId);
  if (isNaN(classificationId)) {
    return res.status(400).send("Invalid classification ID");
  }

  try {
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const classificationList = await utilities.buildClassificationList(classificationId);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: "Vehicles",
      nav,
      classificationList,
      grid
    });
  } catch (error) {
    console.error("getInventoryByClassificationId error: ", error);
    res.status(500).send("Server error");
  }
}


async function buildByInvId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId, 10);
    if (Number.isNaN(invId)) {
      return res.status(400).render("errors/400", {
        title: "Invalid request",
        message: "Invalid vehicle id"
      });
    }

    const vehicle = await invModel.getVehicleById(invId);
    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Not Found",
        message: "Vehicle not found"
      });
    }

    const vehicleDetailHtml = utilities.buildVehicleDetail(vehicle);
    const nav = await utilities.getNav();
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    res.render("inventory/detail", {
      title,
      nav,
      vehicleDetailHtml
    });
  } catch (err) {
    next(err);
  }
}


// Show buildAddClassification
async function buildAddClassification(req, res, next) {
  try {
    const message = req.flash("message");
    const nav = await utilities.getNav();

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: message.length ? message : null,
      errors: null,
      classification_name: ""
    });
  } catch (error) {
    next(error);
  }
}

// form addClassification
async function addClassification(req, res, next) {
  try {
    const errors = validationResult(req);
    const { classification_name } = req.body;

    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: null,
        errors: errors.array(),
        classification_name
      });
    }

    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("message", `Success: ${classification_name} added.`);
      return res.redirect("/inv/");
    } else {
      throw new Error("Failed to add classification.");
    }
  } catch (error) {
    next(error);
  }
}



// add vehicle buildAddInventory
async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    const message = req.flash("message");
    const nav = await utilities.getNav();

    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      message: message.length ? message : null,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image.png",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error);
  }
}

// Vehicle form addInventory
async function addInventory(req, res, next) {
  try {
    const errors = validationResult(req);
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const nav = await utilities.getNav();

    const invData = {
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image.png",
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
    };

    if (!errors.isEmpty()) {
      return res.status(400).render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        message: null,
        errors: errors.array(),
        classificationList,
        ...invData
      });
    }

    const result = await invModel.addInventory(invData);
    if (result) {
      req.flash("message", `Success: ${invData.inv_make} ${invData.inv_model} added.`);
      return res.redirect("/inv/");
    } else {
      throw new Error("Failed to add vehicle.");
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  buildManagementView,
  buildByClassificationId,
  buildByInvId,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
};

