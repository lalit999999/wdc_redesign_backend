import Announcement from "../models/Announcement.js";

const createAnnouncement = async (req, res) => {
    try {
        const { title, message, description, date, time, type, important } = req.body;

        // Validate required fields
        if (!title || (!message && !description)) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title and message/description",
            });
        }

        const announcement = await Announcement.create({
            title,
            description: message || description,
            date,
            time,
            type,
            important,
        });

        console.log("Announcement created successfully:", {
            id: announcement._id,
            title: announcement.title,
            createdAt: announcement.createdAt,
        });

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement,
        });
    } catch (error) {
        console.error("Error creating announcement:", {
            message: error.message,
            errors: error.errors,
            stack: error.stack,
        });
        return res.status(500).json({
            success: false,
            message: "Failed to create announcement",
            error: error.message,
        });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete announcement",
            error: error.message,
        });
    }
};

const getAnnouncements = async (_req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            announcements,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcements",
            error: error.message,
        });
    }
};

export { createAnnouncement, deleteAnnouncement, getAnnouncements };
