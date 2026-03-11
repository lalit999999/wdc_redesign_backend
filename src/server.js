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
import User from "./models/User.js";
import Assignment from "./models/Assignment.js";
import Announcement from "./models/Announcement.js";

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

// Development endpoint to set a user as admin (remove in production)
if (process.env.NODE_ENV !== "production") {
    app.post("/api/dev/make-admin", async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required",
                });
            }

            const user = await User.findOneAndUpdate(
                { email: email.toLowerCase() },
                { role: "admin" },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            console.log(`User ${email} set as admin`);
            return res.status(200).json({
                success: true,
                message: `${email} is now an admin`,
                user,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to update user role",
                error: error.message,
            });
        }
    });

    // Seeding endpoint for fake data
    app.post("/api/dev/seed-data", async (req, res) => {
        try {
            // Get first admin user
            const admin = await User.findOne({ role: "admin" });
            if (!admin) {
                return res.status(400).json({
                    success: false,
                    message: "No admin user found. Please create an admin first.",
                });
            }

            const fakeAssignments = [
                {
                    title: "AWS Deployment",
                    description: "Action: Send a confirmation note regarding your preparation for this task.",
                    deadline: new Date("2026-03-12"),
                    category: "DevOps",
                    createdBy: admin._id,
                },
                {
                    title: "Schema Redesign",
                    description: "Schema Redesign: Analyze the Faculty API data and design a robust MySQL schema. • Requirements: Normalize to 3NF (Third Normal Form) and ensure proper Indexing/Foreign Keys.",
                    deadline: new Date("2026-03-12"),
                    category: "Database",
                    createdBy: admin._id,
                },
                {
                    title: "Admin Panel UI",
                    description: "Prototype distinct views for Faculty vs. Super Admin based on the Full Stack requirements.",
                    deadline: new Date("2026-03-12"),
                    category: "Frontend",
                    createdBy: admin._id,
                },
                {
                    title: "Prototypes",
                    description: "Redesign the NIT Patna Home Page. Redesign the Department layout and inner pages (Faculty list, Labs).",
                    deadline: new Date("2026-03-12"),
                    category: "Design",
                    createdBy: admin._id,
                },
                {
                    title: "Admin Panel (Role-Based Access Control)",
                    description: "Create a secure Admin Panel with distinct roles: 1. Faculty (Role: Can manage/update their own profile only. 2. Super Admin Role: Full access to all modules. Required Modules: Manage Faculty...",
                    deadline: new Date("2026-03-12"),
                    category: "Backend",
                    createdBy: admin._id,
                },
                {
                    title: "WDC Platform Redesign",
                    description: "Redesign the existing WDC platform interface (Backend + Frontend).",
                    deadline: new Date("2025-03-12"),
                    category: "Full Stack",
                    createdBy: admin._id,
                },
            ];

            const fakeAnnouncements = [
                {
                    title: "Regarding Final Assignment...",
                    description: "You may submit any number of assignments, and we will consider your complete profile. The deadline for final...",
                    date: "7th Feb 2026",
                    time: "10:30 AM",
                    type: "info",
                    important: true,
                },
                {
                    title: "🚨 Profile Review Update 🚨",
                    description: "Core Members have started reviewing profiles. Please make sure you have completed the following: 📋 Complete your...",
                    date: "27th Jan 2026",
                    time: "3:45 PM",
                    type: "warning",
                    important: true,
                },
                {
                    title: "Enable View Access for Resume...",
                    description: "We request viewership access to be enabled for all @nitp.ac.in email IDs for the Resume Drive created for We...",
                    date: "22nd Jan 2026",
                    time: "9:00 AM",
                    type: "info",
                    important: true,
                },
                {
                    title: "WDC Induction Timeline – 2026",
                    description: "Phase 1: User Registration 🔥 Sign Up Window: 22 January 2026 – 28 January 2026 Candidates must register on th...",
                    date: "20th Jan 2026",
                    time: "8:00 AM",
                    type: "info",
                    important: true,
                },
            ];

            // Delete existing data (optional - for clean seeding)
            const deleteAssignments = req.body.deleteExisting ? await Assignment.deleteMany({}) : null;
            const deleteAnnouncements = req.body.deleteExisting ? await Announcement.deleteMany({}) : null;

            // Insert assignments
            const createdAssignments = await Assignment.insertMany(fakeAssignments);
            console.log(`Created ${createdAssignments.length} assignments`);

            // Insert announcements
            const createdAnnouncements = await Announcement.insertMany(fakeAnnouncements);
            console.log(`Created ${createdAnnouncements.length} announcements`);

            return res.status(200).json({
                success: true,
                message: "Data seeded successfully",
                data: {
                    assignmentsCreated: createdAssignments.length,
                    announcementsCreated: createdAnnouncements.length,
                    assignments: createdAssignments,
                    announcements: createdAnnouncements,
                },
            });
        } catch (error) {
            console.error("Error seeding data:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to seed data",
                error: error.message,
            });
        }
    });
}

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
