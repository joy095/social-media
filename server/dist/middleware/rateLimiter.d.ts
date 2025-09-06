declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const postLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const interactionLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const commentLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const rateLimiter: {
    general: import("express-rate-limit").RateLimitRequestHandler;
    auth: import("express-rate-limit").RateLimitRequestHandler;
    post: import("express-rate-limit").RateLimitRequestHandler;
    interaction: import("express-rate-limit").RateLimitRequestHandler;
    comment: import("express-rate-limit").RateLimitRequestHandler;
    upload: import("express-rate-limit").RateLimitRequestHandler;
};
export default rateLimiter;
export { generalLimiter, authLimiter, postLimiter, interactionLimiter, commentLimiter, uploadLimiter };
//# sourceMappingURL=rateLimiter.d.ts.map