import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db";
import { User, UserResponse } from "../types/user";

const generateToken = (user: { id: string; email: string }): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      res.status(400).json({ error: "email already registered" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query<User>(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, hashedPassword, name]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost"
    });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("register error:", error);
    res.status(500).json({ error: "server error" });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: "user not found" });
      return;
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(400).json({ error: "invalid credentials" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost"
    });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.json(userResponse);
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost"
  });
  res.json({ message: "logged out successfully" });
};

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query<User>(
      "SELECT id, email, name FROM users WHERE id = $1",
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "user not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("get user error:", error);
    res.status(500).json({ error: "internal server error" });
  }
};
