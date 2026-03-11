import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
    getProfile,
    updateProfile,
    getApplicationStatus,
    getAllUsers,
    approveUser,
    rejectUser,
    createUser,
    createMultipleUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Public bulk endpoint for development/testing
router.post("/bulk", createMultipleUsers);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/application-status", authMiddleware, getApplicationStatus);

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, createUser);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveUser);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectUser);

export default router;
