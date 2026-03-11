import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

const ensureShortlistedStudent = (user) => {
    return user?.applicationStatus === "shortlisted";
};

const createAssignment = async (req, res) => {
    try {
        const { title, description, category, deadline } = req.body;

        // Validate required fields
        if (!title || !description || !category || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, description, category, deadline",
            });
        }

        // Ensure user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const assignment = await Assignment.create({
            title,
            description,
            category,
            deadline,
            createdBy: req.user._id,
        });

        console.log("Assignment created successfully:", {
            id: assignment._id,
            title: assignment.title,
            createdBy: assignment.createdBy,
        });

        return res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            assignment,
        });
    } catch (error) {
        console.error("Error creating assignment:", {
            message: error.message,
            errors: error.errors,
            stack: error.stack,
        });
        return res.status(500).json({
            success: false,
            message: "Failed to create assignment",
            error: error.message,
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete assignment",
            error: error.message,
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        // Allow both admins and shortlisted students to access assignments
        const isAdmin = req.user?.role === "admin";
        const isShortlisted = ensureShortlistedStudent(req.user);

        if (!isAdmin && !isShortlisted) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const assignments = await Assignment.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            assignments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments",
            error: error.message,
        });
    }
};

const submitAssignment = async (req, res) => {
    try {
        if (!ensureShortlistedStudent(req.user)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({
                success: false,
                message: "Submission deadline has passed",
            });
        }

        const existingSubmission = await Submission.findOne({
            studentId: req.user._id,
            assignmentId: req.params.id,
        });

        if (existingSubmission) {
            return res.status(409).json({
                success: false,
                message: "Assignment already submitted",
            });
        }

        const { githubLink, hostedLink, finalResumeLink, remark } = req.body;

        const submission = await Submission.create({
            studentId: req.user._id,
            assignmentId: req.params.id,
            githubLink,
            hostedLink,
            finalResumeLink,
            remark,
        });

        return res.status(201).json({
            success: true,
            message: "Assignment submitted successfully",
            submission,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to submit assignment",
            error: error.message,
        });
    }
};

export {
    createAssignment,
    deleteAssignment,
    getAssignments,
    submitAssignment,
};
