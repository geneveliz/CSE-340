const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.get("/", favoriteController.showFavorites);
router.post("/add/:carId", favoriteController.addFavorite);
router.post("/remove/:carId", favoriteController.removeFavorite);
router.post("/add", favoriteController.addFavorite);
module.exports = router;