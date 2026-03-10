import jwt from "jsonwebtoken";

const googleAuthSuccess = (req, res) => {
    const user = req.user;
    const jwtSecret = process.env.JWT_SECRET;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }

    if (!jwtSecret) {
        return res.status(500).json({
            success: false,
            message: "JWT secret is not configured",
        });
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

    return res.status(200).json({
        success: true,
        message: "Google authentication successful",
        token,
        user,
    });
};

const googleAuthFailure = (_req, res) => {
    return res.status(401).json({
        success: false,
        message: "Google authentication failed",
    });
};

export { googleAuthSuccess, googleAuthFailure };
