import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing or invalid format",
            });
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is not configured",
            });
        }

        const decoded = jwt.verify(token, jwtSecret);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized",
            });
        }

        req.user = user;
        return next();
    } catch (_error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authMiddleware;
