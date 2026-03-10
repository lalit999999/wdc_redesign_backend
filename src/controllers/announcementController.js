import Announcement from "../models/Announcement.js";

const createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;

        const announcement = await Announcement.create({ title, description });

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement,
        });
    } catch (error) {
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
