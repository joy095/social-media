const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    console.error('Error:', err);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            message,
            statusCode: 404
        };
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        let message = 'Duplicate field value entered';
        // Extract field name from error
        const field = Object.keys(err.keyValue)[0];
        if (field === 'email') {
            message = 'Email address is already registered';
        }
        else if (field === 'username') {
            message = 'Username is already taken';
        }
        error = {
            message,
            statusCode: 400
        };
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401
        };
    }
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401
        };
    }
    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File too large';
        error = {
            message,
            statusCode: 413
        };
    }
    // Multer file count error
    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'Too many files uploaded';
        error = {
            message,
            statusCode: 413
        };
    }
    // Multer unexpected field error
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field';
        error = {
            message,
            statusCode: 400
        };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map