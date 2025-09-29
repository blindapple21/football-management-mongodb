import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

// You may extend the Express Request interface to include user info if desired
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Access token missing" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    // Optionally attach the payload to the request object
    // (Extend Request interface if needed)
    // req.user = payload as TokenPayload;
    next();
  });
};
