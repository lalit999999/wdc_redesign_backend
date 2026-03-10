import jwt from "jsonwebtoken";

const googleAuthSuccess = (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
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
