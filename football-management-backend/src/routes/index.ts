import { Router, Request, Response } from "express";
import { db } from "../config/db";

const router: Router = Router();

// Root route - simple check if API is working
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: "Football Management API is running" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check that also verifies DB connection
router.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    // Simple MongoDB ping to check connection
    await db.command({ ping: 1 });
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

export default router;
