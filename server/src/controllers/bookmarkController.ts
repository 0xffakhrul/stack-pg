import { Request, Response } from "express";
import pool from "../db";
import { fetchMetadata } from "../utils/metadata";

export const createBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { url, tags } = req.body;
    const userId = req.user?.id;

    //fetch metadata
    const metadata = await fetchMetadata(url);

    const result = await pool.query(
      "INSERT INTO bookmarks (title, description, url, tags, user_id, favicon) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        metadata.title,
        metadata.description,
        url,
        tags,
        userId,
        metadata.favicon,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({ error: "Failed to create bookmark" });
  }
};

export const getBookmarks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

export const updateBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, url, tags } = req.body;
    const userId = req.user?.id;

    const result = await pool.query(
      "UPDATE bookmarks SET title = $1, description = $2, url = $3, tags = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [title, description, url, tags, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Bookmark not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({ error: "Failed to update bookmark" });
  }
};

export const deleteBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      "DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Bookmark not found" });
      return;
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
};
