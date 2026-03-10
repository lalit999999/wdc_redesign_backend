import express from "express";
import passport from "passport";
import {
    googleAuthSuccess,
    googleAuthFailure,
} from "../controllers/authController.js";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/google/failure",
    }),
    googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

export default router;
