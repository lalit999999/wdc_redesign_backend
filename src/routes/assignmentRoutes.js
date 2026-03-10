import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
    createAssignment,
    deleteAssignment,
    getAssignments,
    submitAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createAssignment);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAssignment);

router.get("/", authMiddleware, getAssignments);
router.post("/:id/submit", authMiddleware, submitAssignment);

export default router;
