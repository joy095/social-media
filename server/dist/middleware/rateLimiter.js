import rateLimit from 'express-rate-limit';
// General API rate limiting
const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') || 1 * 60 * 1000, // 1 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Strict rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
    skipSuccessfulRequests: true, // Don't count successful requests
});
// Rate limiting for post creation
const postLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 posts per windowMs
    message: {
        success: false,
        message: 'Too many posts created, please try again later.',
    },
});
// Rate limiting for likes and follows (to prevent spam)
const interactionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 interactions per minute
    message: {
        success: false,
        message: 'Too many interactions, please slow down.',
    },
});
// Rate limiting for comments
const commentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 comments per minute
    message: {
        success: false,
        message: 'Too many comments, please slow down.',
    },
});
// Rate limiting for file uploads
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 uploads per windowMs
    message: {
        success: false,
        message: 'Too many file uploads, please try again later.',
    },
});
const rateLimiter = {
    general: generalLimiter,
    auth: authLimiter,
    post: postLimiter,
    interaction: interactionLimiter,
    comment: commentLimiter,
    upload: uploadLimiter
};
export default rateLimiter;
export { generalLimiter, authLimiter, postLimiter, interactionLimiter, commentLimiter, uploadLimiter };
//# sourceMappingURL=rateLimiter.js.map