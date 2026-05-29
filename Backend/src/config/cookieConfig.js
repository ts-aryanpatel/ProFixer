// backend/utils/cookieConfig.js

// Agar NODE_ENV production hai to iska matlab app live Render par chal rahi hai
const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
    httpOnly: true,
    secure: isProduction,                   // Production (HTTPS) me true, Local (HTTP) me false
    sameSite: isProduction ? "none" : "lax", // Production me cross-domain ke liye "none", Local me "lax"
    maxAge: 7 * 24 * 60 * 60 * 1000         // 7 din tak cookie valid rahegi
};