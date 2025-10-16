// models/favoriteModel.js
const pool = require("../database");

/* Guarda un vehículo como favorito */
async function addFavorite(inv_id) {
  const sql = "INSERT INTO favorites (inv_id) VALUES ($1) ON CONFLICT DO NOTHING";
  return pool.query(sql, [inv_id]);
}

/* Elimina un vehículo de favoritos */
async function removeFavorite(inv_id) {
  const sql = "DELETE FROM favorites WHERE inv_id = $1";
  return pool.query(sql, [inv_id]);
}

/* Obtiene todos los vehículos favoritos */
async function getFavorites() {
  const sql = `
    SELECT f.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_image
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    ORDER BY i.inv_make;
  `;
  const result = await pool.query(sql);
  return result.rows;
}

module.exports = { addFavorite, removeFavorite, getFavorites };
