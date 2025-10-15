
const pool = require("../database/index")

/* *****************************
 * Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`;
      
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    
    return result; 
  } catch (error) {
    console.error("registerAccount model error: ", error);
    return null;
  }
}


/* *****************************
 * Check if email already exists
 * *************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return 0
  }
}

/* *****************************
 * Get account email for login
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type
      FROM account
      WHERE LOWER(account_email) = LOWER($1)`;

    const result = await pool.query(sql, [account_email]);
    console.log("Query result for email:", account_email, result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error:", error);
    return null;
  }
}

/* *****************************
 * for account management view
 * *************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1`
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
 * Update info name, email
 * *************************** */
async function updateAccount(id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4
      RETURNING *`
    const result = await pool.query(sql, [firstname, lastname, email, id])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* *****************************
 * Update password
 * *************************** */
async function updatePassword(id, hash) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *`
    const result = await pool.query(sql, [hash, id])
    return result.rows[0]
  } catch (error) {
    console.error("updatePassword error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}




