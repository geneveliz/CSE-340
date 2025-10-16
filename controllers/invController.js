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
      errors: null,
    });
  } catch (error) {
    return next(error);
  }
}

// View buildByClassificationId
async function buildByClassificationId(req, res, next) {
  const classificationId = parseInt(req.params.classificationId, 10);
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
      grid,
    });
  } catch (error) {
    console.error("getInventoryByClassificationId error: ", error);
    return res.status(500).send("Server error");
  }
}

// Build single vehicle detail view
async function buildByInvId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId, 10);
    if (Number.isNaN(invId)) {
      return res.status(400).render("errors/400", {
        title: "Invalid request",
        message: "Invalid vehicle id",
      });
    }

    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Not Found",
        message: "Vehicle not found",
      });
    }

    // HTML Vehicle
    let vehicleDetailHtml = utilities.buildVehicleDetail(vehicle);

    // favorites and note
    vehicleDetailHtml += `
      <div class="vehicle-actions" style="margin-top: 20px;">
        <form action="/favorites/add" method="POST" style="margin-bottom:10px;">
          <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
          <button type="submit" class="btn btn-primary">⭐ Add To Favorites</button>
        </form>

        <form action="/notes/add" method="POST">
          <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
          <textarea name="note" placeholder="Write a note..." required
            style="width:100%;height:80px;margin-bottom:10px;"></textarea>
          <button type="submit" class="btn btn-secondary">📝 Save Note</button>
        </form>
      </div>
    `;

    const nav = await utilities.getNav();
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    res.render("inventory/detail", {
      title,
      nav,
      vehicleDetailHtml,
    });
  } catch (err) {
    console.error("Error in buildByInvId:", err);
    return next(err);
  }
}


module.exports = {
  buildManagementView,
  buildByClassificationId,
  buildByInvId,
};




