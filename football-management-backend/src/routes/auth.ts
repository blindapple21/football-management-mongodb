import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();

// User Registration
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    if (role !== "player" && role !== "manager") {
        res.status(400).json({ message: "Invalid role." });
        return;
    }

    try {
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "Email already in use." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// User Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    try {
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;