const pool = require('../database') 

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
    )
    return data
  } catch (error) {
    console.error(" getClassifications error:", error)
    return { rows: [] } 
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error('addClassification error:', error);
    throw error;
  }
}

/* ***************************
 *  items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory AS i
      JOIN classification AS c 
        ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
    `;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error('getInventoryByClassificationId error:', error);
    return null;
  }
}

/* ***************************
 *  single inventory item by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory AS i
      JOIN classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('getVehicleById error:', error);
    return null;
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `
      INSERT INTO inventory
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      invData.classification_id,
      invData.inv_make,
      invData.inv_model,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_year,
      invData.inv_miles,
      invData.inv_color,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error('addInventory error:', error);
    throw error;
  }
}


module.exports = {
  getClassifications,
  addClassification,
  getInventoryByClassificationId,
  getVehicleById,
  addInventory
};