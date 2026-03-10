import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
