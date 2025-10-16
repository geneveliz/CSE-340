const db = require("../database");

async function getNotesByUser(userId) {
  const sql = `
    SELECT cn.*, i.inv_make, i.inv_model 
    FROM car_notes cn
    JOIN inventory i ON cn.car_id = i.inv_id
    WHERE cn.user_id = $1
  `;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

async function addNote(userId, carId, content) {
  const sql = `
    INSERT INTO car_notes (user_id, car_id, content)
    VALUES ($1, $2, $3)
  `;
  return db.query(sql, [userId, carId, content]);
}

module.exports = {
  getNotesByUser,
  addNote,
};
