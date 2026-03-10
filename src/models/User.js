import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            trim: true,
        },
        githubLink: {
            type: String,
            trim: true,
        },
        linkedinLink: {
            type: String,
            trim: true,
        },
        resumeLink: {
            type: String,
            trim: true,
        },
        about: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "student"],
            default: "student",
        },
        applicationStatus: {
            type: String,
            enum: ["pending", "shortlisted", "rejected"],
            default: "pending",
        },
        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
