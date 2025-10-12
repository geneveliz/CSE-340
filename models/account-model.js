/* *****************************
*  new account
* *************************** */
const pool = require("../database/index");
/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
    return result;
  } catch (error) {
    console.error("registerAccount model error: ", error);
    return null;  
  }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    console.error(error)
    return 0
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,  
};