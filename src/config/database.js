import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://sahaj_owner:npg_o7sxOwSYzK3Q@ep-small-math-a8rs6yts-pooler.eastus2.azure.neon.tech/sahaj?sslmode=require",
});

// Test connection
async function testConnection() {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log(
      "✅ Successfully connected to Neon database. Current time:",
      rows[0].now
    );
  } catch (err) {
    console.error("❌ Error acquiring client", err.stack);
    console.error(
      "Please check your database connection parameters in .env file"
    );
  }
}

// Create tables
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL, 
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tables are ready");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    console.error("Please check your database connection and permissions");
  }
};

// Execute
(async () => {
  await testConnection();
  await createTables();
})();

export default pool;
