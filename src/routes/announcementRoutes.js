import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
} from "../controllers/announcementController.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createAnnouncement);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAnnouncement);

router.get("/", authMiddleware, getAnnouncements);

export default router;
