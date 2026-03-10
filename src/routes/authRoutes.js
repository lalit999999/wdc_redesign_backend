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
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: info?.message || "Google authentication failed",
                });
            }

            req.user = user;
            return googleAuthSuccess(req, res);
        })(req, res, next);
    }
);

router.get("/google/failure", googleAuthFailure);

export default router;
