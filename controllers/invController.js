const invModel = require("../models/inventory-model")
const Util = require("../utilities/index") 

/* Show inventory by classification */
async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId, 10)
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await Util.buildClassificationGrid(data)
    res.render("inventory/classification", {
      title: "Inventory",
      grid,
      nav: res.locals.nav 
    })
  } catch (err) {
    next(err)
  }
}

/* Detail view specific inventory  */
async function buildByInvId(req, res, next) {
  try {
    const invId = parseInt(req.params.invId, 10)
    if (Number.isNaN(invId)) {
      return res.status(400).render("errors/400", { title: "Invalid request", message: "Invalid vehicle id" })
    }

    const vehicle = await invModel.getVehicleById(invId)
    if (!vehicle) {
      // 404 via error view 
      return res.status(404).render("errors/404", { title: "Not Found", message: "Vehicle not found" })
    }

    const vehicleDetailHtml = Util.buildVehicleDetail(vehicle)

    // Title must display 
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/detail", {
      title,
      nav: res.locals.nav,
      vehicleDetailHtml
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {buildByClassificationId,buildByInvId}
