import rateLimit from 'express-rate-limit';

// Login rate limiter: 5 attempts per 15 minutes
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts. Please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req, res) => {
        // Skip rate limiting for non-auth endpoints
        return false;
    },
    keyGenerator: (req, res) => {
        // Use IP + email combination for more accurate rate limiting
        return `${req.ip}-${req.body?.email || ''}`;
    },
});

// Register rate limiter: 3 attempts per hour (more strict to prevent spam)
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: 'Too many registration attempts. Please try again after 1 hour.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    keyGenerator: (req, res) => {
        return `${req.ip}-${req.body?.email || req.body?.phoneNumber || ''}`;
    },
});

// General API rate limiter: 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Refresh token rate limiter: 10 attempts per 15 minutes
export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many token refresh attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
