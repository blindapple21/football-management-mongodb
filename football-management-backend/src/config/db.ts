import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection string from environment variable or use default
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2";

// Create a new MongoDB client
const client = new MongoClient(MONGO_URI);

// Database reference
const dbName = process.env.DB_NAME || "football_management";
let db: any;

// Connect to database
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Database");
    
    // Get reference to database
    db = client.db(dbName);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit with failure
  }
}

// Initialize connection
connectDB();

// Export both client and db for flexibility
export { client, db };
export default db;
