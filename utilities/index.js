const pool = require("../database/");
const invModel = require("../models/inventory-model");
const { validationResult } = require("express-validator");

const Util = {};

/*  navigation bar */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    if (!data || !data.rows) {
      console.error("⚠️ No classification data found in getNav()")
      return '<ul><li><a href="/">Home</a></li></ul>'
    }

    let list = '<ul>'
    list += '<li><a href="/">Home</a></li>'
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
    })
    list += '</ul>'
    return list
  } catch (error) {
    console.error("getNav error:", error)
    return '<ul><li><a href="/">Home</a></li></ul>'
  }
}

/* classification grid HTML */
Util.buildClassificationGrid = function (data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    
    let thumbnail = vehicle.inv_thumbnail;
    if (!thumbnail.startsWith('/images/vehicles/')) {
      thumbnail = `/images/vehicles/${thumbnail}`;
    }

    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr>
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
  });
  grid += "</ul>";
  return grid;
};

/* vehicle detail view HTML */
Util.buildVehicleDetail = (vehicle) => {
  console.log("Vehicle image:", vehicle.inv_image);

  return `
    <div class="vehicle-detail-container">
      <div>
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div>
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat().format(vehicle.inv_miles)} miles</p>
        <p>${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
};



/* Build classification  */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (classification_id != null && row.classification_id == classification_id) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error(" Error building classification list:", error);
    return `<select name="classification_id">
              <option value="">Error loading classifications</option>
            </select>`;
  }
};

/*  Error wrapper for async route handlers
 */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* Login View */
Util.buildLogin = async function (req, res, next) {
  const nav = await Util.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
};

/* all utilities */
module.exports = Util;