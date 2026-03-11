import express from "express";
import { makeAdmin, seedData } from "../controllers/devController.js";

const router = express.Router();

// Development endpoints (only available in development)
router.post("/make-admin", makeAdmin);
router.post("/seed-data", seedData);

export default router;
