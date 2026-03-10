import User from "../models/User.js";
import { calculateProfileCompletion } from "../utils/profileCompletion.js";

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "fullName",
            "mobileNumber",
            "githubLink",
            "linkedinLink",
            "resumeLink",
            "about",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        }

        const existingUser = await User.findById(req.user._id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const mergedData = {
            ...existingUser.toObject(),
            ...updates,
        };

        updates.profileCompletion = calculateProfileCompletion(mergedData);

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select("-__v");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

const getApplicationStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("applicationStatus");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            applicationStatus: user.applicationStatus,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch application status",
            error: error.message,
        });
    }
};

const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find().select("-__v");

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

const approveUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { applicationStatus: "shortlisted" },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User approved successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to approve user",
            error: error.message,
        });
    }
};

const rejectUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { applicationStatus: "rejected" },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User rejected successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reject user",
            error: error.message,
        });
    }
};

export {
    getProfile,
    updateProfile,
    getApplicationStatus,
    getAllUsers,
    approveUser,
    rejectUser,
};
