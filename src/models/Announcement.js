import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
            trim: true,
        },
        time: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ["info", "success", "warning"],
            default: "info",
        },
        important: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
