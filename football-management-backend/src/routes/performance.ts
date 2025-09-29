import { Router, Request, Response } from "express";
import { db } from "../config/db";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = Router();

// Get all performance records
router.get("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const performanceCollection = db.collection('performance');
    const performances = await performanceCollection.find({}).toArray();
    res.json(performances);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ message: "Error fetching performance data" });
  }
});

// Get performance records by player ID
router.get("/player/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playerId = req.params.id;
    const performanceCollection = db.collection('performance');
    const performances = await performanceCollection.find({ player_id: playerId }).toArray();
    res.json(performances);
  } catch (error) {
    console.error("Error fetching player performance:", error);
    res.status(500).json({ message: "Error fetching player performance" });
  }
});

// Create a new performance record
router.post("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const performanceData = req.body;
    const performanceCollection = db.collection('performance');
    
    await performanceCollection.insertOne(performanceData);
    
    res.status(201).json({ message: "Performance record created successfully" });
  } catch (error) {
    console.error("Error creating performance record:", error);
    res.status(500).json({ message: "Error creating performance record" });
  }
});

// Update a performance record
router.put("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const performanceId = req.params.id;
    const performanceData = req.body;
    const performanceCollection = db.collection('performance');
    
    await performanceCollection.updateOne(
      { _id: new ObjectId(performanceId) },
      { $set: performanceData }
    );
    
    res.json({ message: "Performance record updated successfully" });
  } catch (error) {
    console.error("Error updating performance record:", error);
    res.status(500).json({ message: "Error updating performance record" });
  }
});

// Delete a performance record
router.delete("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const performanceId = req.params.id;
    const performanceCollection = db.collection('performance');
    
    await performanceCollection.deleteOne({ _id: new ObjectId(performanceId) });
    
    res.json({ message: "Performance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting performance record:", error);
    res.status(500).json({ message: "Error deleting performance record" });
  }
});

export default router;
