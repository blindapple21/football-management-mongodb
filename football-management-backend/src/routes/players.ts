import { Router, Request, Response } from "express";
import { db } from "../config/db";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = Router();

// Get all players
router.get("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playersCollection = db.collection('players');
    const players = await playersCollection.find({}).toArray();
    res.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Error fetching players" });
  }
});

// Get a player by ID
router.get("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playerId = req.params.id;
    const playersCollection = db.collection('players');
    const player = await playersCollection.findOne({ _id: new ObjectId(playerId) });
    
    if (!player) {
      res.status(404).json({ message: "Player not found" });
      return;
    }
    
    res.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ message: "Error fetching player" });
  }
});

// Create a new player
router.post("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playerData = req.body;
    const playersCollection = db.collection('players');
    
    await playersCollection.insertOne(playerData);
    
    res.status(201).json({ message: "Player created successfully" });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ message: "Error creating player" });
  }
});

// Update a player
router.put("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playerId = req.params.id;
    const playerData = req.body;
    const playersCollection = db.collection('players');
    
    await playersCollection.updateOne(
      { _id: new ObjectId(playerId) },
      { $set: playerData }
    );
    
    res.json({ message: "Player updated successfully" });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Error updating player" });
  }
});

// Delete a player
router.delete("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const playerId = req.params.id;
    const playersCollection = db.collection('players');
    
    await playersCollection.deleteOne({ _id: new ObjectId(playerId) });
    
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ message: "Error deleting player" });
  }
});

export default router;
