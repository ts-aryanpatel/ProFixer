// Cookie configuration for secure token storage
const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
    httpOnly: true,           // JS cannot access - prevents XSS theft
    secure: isProduction,     // HTTPS only in production
    sameSite: isProduction ? "none" : "strict", // strict is most secure, none requires secure:true
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Separate config for access token (shorter expiry)
export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 15 * 60 * 1000 // 15 minutes
};

// Separate config for refresh token (longer expiry)
export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};