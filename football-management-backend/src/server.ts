import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";
import authRoutes from "./routes/auth";
import playerRoutes from "./routes/players";
import performanceRoutes from "./routes/performance"; // Import players routes
import scheduleRoutes from "./routes/schedules";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/players", playerRoutes);
app.use("/performance", performanceRoutes);
app.use("/schedules", scheduleRoutes)

app.use("/auth", authRoutes);
app.use("/players", playerRoutes); // Mount players routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Football Management System backend running on port ${PORT}`);
});
