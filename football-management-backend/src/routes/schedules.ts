import { format } from "date-fns";
import { Router, Request, Response } from "express";
import { db } from "../config/db";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = Router();

// Get all schedules (protected route)
router.get("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const schedulesCollection = db.collection('schedules');
    const schedules = await schedulesCollection.find({}).toArray();
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Error fetching schedules" });
  }
});

// Create a new schedule (protected route)
router.post("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { match_date, opponent, location, time, type, competition } = req.body;
    // Convert match_date to Date object
    const schedulesCollection = db.collection('schedules');
    
    await schedulesCollection.insertOne({
      match_date: new Date(match_date),
      opponent,
      location,
      time,
      type,
      competition
    });
    
    res.status(201).json({ message: "Schedule created successfully" });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Error creating schedule" });
  }
});

// Update an existing schedule (protected route)
router.put("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { match_date, opponent, location, time, type, competition } = req.body;
    const scheduleId = req.params.id;
    const schedulesCollection = db.collection('schedules');
    
    await schedulesCollection.updateOne(
      { _id: new ObjectId(scheduleId) },
      { $set: {
          match_date: new Date(match_date),
          opponent,
          location,
          time,
          type,
          competition
        }
      }
    );
    
    res.json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Error updating schedule" });
  }
});

// Delete a schedule (protected route)
router.delete("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const scheduleId = req.params.id;
    const schedulesCollection = db.collection('schedules');
    
    await schedulesCollection.deleteOne({ _id: new ObjectId(scheduleId) });
    
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Error deleting schedule" });
  }
});

export default router;
