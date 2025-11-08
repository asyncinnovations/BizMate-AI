// src/config/db.ts
import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✔ Connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};
