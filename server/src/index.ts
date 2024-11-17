import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import pool from "./db";
import authRoutes from "./routes/authRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://stack-pg.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected!", result.rows[0]);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
