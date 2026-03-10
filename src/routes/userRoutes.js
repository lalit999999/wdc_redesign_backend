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
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/application-status", authMiddleware, getApplicationStatus);

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveUser);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectUser);

export default router;
