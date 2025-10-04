const invModel = require("../models/inventory-model")

const Util = {}

/* ***************************
 *  Build the navigation bar
 * ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error:", error)
    throw error
  }
}

/* ***************************
 *  Build the classification view HTML
 * ************************** */
Util.buildClassificationGrid = async function (data) {
  if (data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  let grid = '<ul id="inv-display">'
  data.forEach((vehicle) => {
    grid += "<li>"
    grid +=
      '<a href="/inv/detail/' +
      vehicle.inv_id +
      '" title="View ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' details"><img src="' +
      vehicle.inv_thumbnail +
      '" alt="Image of ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' on CSE Motors"></a>'
    grid += '<div class="namePrice">'
    grid += "<hr />"
    grid += "<h2>"
    grid +=
      '<a href="/inv/detail/' +
      vehicle.inv_id +
      '" title="View ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' details">' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      "</a>"
    grid += "</h2>"
    grid +=
      "<span>$" +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      "</span>"
    grid += "</div>"
    grid += "</li>"
  })
  grid += "</ul>"
  return grid
}

/* ***************************
 *  Build a vehicle detail view HTML
 * ************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }

  const price = new Intl.NumberFormat("en-US").format(vehicle.inv_price || 0)
  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles || 0)

  let detail = ''
  detail += `<section class="vehicle-detail">`
  detail += `  <div class="vehicle-detail__image">`
  detail += `    <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`
  detail += `  </div>`
  detail += `  <div class="vehicle-detail__info">`
  detail += `    <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`
  detail += `    <h2>${vehicle.inv_year} — <span class="price">$${price}</span></h2>`
  detail += `    <p><strong>Mileage:</strong> ${miles} miles</p>`
  if (vehicle.inv_description) {
    detail += `<p>${vehicle.inv_description}</p>`
  }
  if (vehicle.inv_color) detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  if (vehicle.inv_transmission) detail += `<p><strong>Transmission:</strong> ${vehicle.inv_transmission}</p>`
  detail += `  </div>`
  detail += `</section>`
  return detail
}

/* ***************************
 *  Error wrapper for async route handlers
 * ************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = Util
