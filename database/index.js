/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("✅ Query executed:", text);
        return res;
      } catch (error) {
        console.error("❌ Query error:", text, error.message);
        throw error;
      }
    },
  };
} else {
  // use default pool export
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
  });

  module.exports = pool;
}

