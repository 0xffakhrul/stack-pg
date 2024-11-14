import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "access denied!" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified as { id: string; email: string };
    next();
  } catch (error) {
    res.status(403).json({ error: "invalid token" });
    return;
  }
};
