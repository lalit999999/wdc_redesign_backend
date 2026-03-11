import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Announcement from "../models/Announcement.js";

// Make a user an admin
export const makeAdmin = async (req, res) => {
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

        return res.json({
            success: true,
            message: `${email} is now an admin`,
            user,
        });
    } catch (error) {
        console.error("Error making admin:", error);
        return res.status(500).json({
            success: false,
            message: "Error making user admin",
            error: error.message,
        });
    }
};

// Seed fake data
export const seedData = async (req, res) => {
    try {
        const { deleteExisting } = req.body;

        // Delete existing data if requested
        if (deleteExisting) {
            await Assignment.deleteMany({});
            await Announcement.deleteMany({});
        }

        // Get an admin user to use as createdBy
        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            // If no admin exists, find any user or create a default one
            adminUser = await User.findOne({});
            if (!adminUser) {
                return res.status(400).json({
                    success: false,
                    message: "No users found. Please create a user first.",
                });
            }
        }

        // Seed Assignments (6 assignments)
        const assignmentsData = [
            {
                title: "AWS Deployment",
                description: "Action: Send a confirmation note regarding your preparation for this task.",
                category: "DevOps",
                deadline: new Date("2026-03-12"),
                createdBy: adminUser._id,
            },
            {
                title: "Schema Redesign",
                description:
                    "Schema Redesign: Analyze the Faculty API data and design a robust MySQL schema. • Requirements: Normalize to 3NF (Third Normal Form) and ensure proper Indexing/Foreign Keys.",
                category: "Database",
                deadline: new Date("2026-03-12"),
                createdBy: adminUser._id,
            },
            {
                title: "Admin Panel UI",
                description:
                    "Prototype distinct views for Faculty vs. Super Admin based on the Full Stack requirements.",
                category: "Frontend",
                deadline: new Date("2026-03-12"),
                createdBy: adminUser._id,
            },
            {
                title: "Prototypes",
                description:
                    "Redesign the NIT Patna Home Page. Redesign the Department layout and inner pages (Faculty list, Labs).",
                category: "Design",
                deadline: new Date("2026-03-12"),
                createdBy: adminUser._id,
            },
            {
                title: "Admin Panel (Role-Based Access Control)",
                description:
                    "Create a secure Admin Panel with distinct roles: 1. Faculty (Role: Can manage/update their own profile only. 2. Super Admin Role: Full access to all modules. Required Modules: Manage Faculty...",
                category: "Backend",
                deadline: new Date("2026-03-12"),
                createdBy: adminUser._id,
            },
            {
                title: "WDC Platform Redesign",
                description: "Redesign the existing WDC platform interface (Backend + Frontend).",
                category: "Full Stack",
                deadline: new Date("2025-03-12"),
                createdBy: adminUser._id,
            },
        ];

        const createdAssignments = await Assignment.insertMany(assignmentsData);

        // Seed Announcements (4 announcements)
        const announcementsData = [
            {
                title: "Regarding Final Assignment...",
                description:
                    "You may submit any number of assignments, and we will consider your complete profile. The deadline for final...",
                type: "info",
                date: "7th Feb 2026",
                time: "10:30 AM",
                important: true,
            },
            {
                title: "🚨 Profile Review Update 🚨",
                description:
                    "Core Members have started reviewing profiles. Please make sure you have completed the following: 📋 Complete your...",
                type: "warning",
                date: "27th Jan 2026",
                time: "3:45 PM",
                important: true,
            },
            {
                title: "Enable View Access for Resume...",
                description:
                    "We request viewership access to be enabled for all @nitp.ac.in email IDs for the Resume Drive created for We...",
                type: "info",
                date: "22nd Jan 2026",
                time: "9:00 AM",
                important: true,
            },
            {
                title: "WDC Induction Timeline – 2026",
                description:
                    "Phase 1: User Registration 🔥 Sign Up Window: 22 January 2026 – 28 January 2026 Candidates must register on th...",
                type: "info",
                date: "20th Jan 2026",
                time: "8:00 AM",
                important: true,
            },
        ];

        const createdAnnouncements = await Announcement.insertMany(announcementsData);

        return res.json({
            success: true,
            message: "Fake data seeded successfully",
            data: {
                assignmentsCreated: createdAssignments.length,
                announcementsCreated: createdAnnouncements.length,
            },
        });
    } catch (error) {
        console.error("Error seeding data:", error);
        return res.status(500).json({
            success: false,
            message: "Error seeding data",
            error: error.message,
        });
    }
};
