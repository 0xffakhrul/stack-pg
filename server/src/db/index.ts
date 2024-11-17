import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("db connection error:", err);
  } else {
    console.log("CONNECTEDDDDDD");
  }
});

export default pool;
