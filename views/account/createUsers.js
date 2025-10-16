const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createUsers() {
  try {
    const adminPassword = await bcrypt.hash('AdminPass123', 10);
    const employeePassword = await bcrypt.hash('EmployeePass123', 10);

    // Insert admin user table
    await pool.query(
      `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (account_email) DO NOTHING`,
      ['Admin', 'User', 'admin@example.com', adminPassword, 'admin']
    );

    // Insert client user table
    await pool.query(
      `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (account_email) DO NOTHING`,
      ['Employee', 'User', 'employee@example.com', employeePassword, 'employee']
    );

    console.log('Admin and employee accounts created (if they did not exist)');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await pool.end();
  }
}

createUsers();