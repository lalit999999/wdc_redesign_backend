import jwt from "jsonwebtoken";

const googleAuthSuccess = (req, res) => {
    const user = req.user;
    const jwtSecret = process.env.JWT_SECRET;

    // Get frontend URL from environment or use default
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

    if (!user) {
        return res.redirect(
            `${frontendURL}/auth-callback?error=Authentication failed`
        );
    }

    if (!jwtSecret) {
        return res.redirect(
            `${frontendURL}/auth-callback?error=JWT secret is not configured`
        );
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        jwtSecret,
        {
            expiresIn: "7d",
        }
    );

    // Instead of returning JSON, redirect to frontend with token and user data
    const redirectURL = `${frontendURL}/auth-callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
    )}`;

    return res.redirect(redirectURL);
};

const googleAuthFailure = (_req, res) => {
    return res.status(401).json({
        success: false,
        message: "Google authentication failed",
    });
};

export { googleAuthSuccess, googleAuthFailure };
