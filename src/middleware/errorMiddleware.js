const notFoundMiddleware = (req, _res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorMiddleware = (error, _req, res, _next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error";

    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((value) => value.message)
            .join(", ");
    }

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Unauthorized access";
    }

    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid request data";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export { notFoundMiddleware, errorMiddleware };
