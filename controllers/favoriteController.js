// controllers/favoriteController.js
const favoriteModel = require("../models/favoriteModel");
const utilities = require("../utilities");

/* ===========================
   Show list of favorites
=========================== */
async function showFavorites(req, res, next) {
  try {
    const favorites = await favoriteModel.getFavorites();
    const nav = await utilities.getNav();

    res.render("favorites/list", {
      title: "My Favorite Vehicles",
      nav,
      favorites,
      message: req.flash("message") || null,
    });
  } catch (error) {
    console.error("Error loading favorites:", error);
    next(error);
  }
}

/* ===========================
   Add a vehicle to favorites
=========================== */
async function addFavorite(req, res, next) {
  try {
    const inv_id = req.body.inv_id || req.params.carId;
    if (!inv_id) {
      req.flash("message", "No vehicle ID provided.");
      return res.redirect("/inventory");
    }

    await favoriteModel.addFavorite(inv_id);
    req.flash("message", "Vehicle added to favorites!");
    res.redirect(`/inventory/detail/${inv_id}`);
  } catch (error) {
    console.error("Error adding favorite:", error);
    next(error);
  }
}

/* ===========================
   Remove from favorites
=========================== */
async function removeFavorite(req, res, next) {
  try {
    const inv_id = req.params.carId;
    await favoriteModel.removeFavorite(inv_id);

    req.flash("message", "Vehicle removed from favorites.");
    res.redirect("/favorites");
  } catch (error) {
    console.error("Error removing favorite:", error);
    next(error);
  }
}

module.exports = {
  showFavorites,
  addFavorite,
  removeFavorite,
};
