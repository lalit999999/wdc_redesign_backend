import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import { notFoundMiddleware, errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Backend is running" });
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "WDC Server is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/announcements", announcementRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
