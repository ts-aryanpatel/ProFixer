import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Generic function jo kisi bhi secret ke saath kaam kare
export const generateToken = (payload, secret, expiry) => {
    return jwt.sign(
        payload, 
        secret, 
        { expiresIn: expiry }
    );
};

// Access Token helper
export const generateAccessToken = (user) => {
    return generateToken(
        { id: user.id, role: user.role || "provider" }, 
        config.ACCESS_TOKEN_SECRET, 
        config.ACCESS_TOKEN_EXPIRY || "1d"
    );
};

// Refresh Token helper
export const generateRefreshToken = (id) => {
    return generateToken(
        { id }, 
        config.REFRESH_TOKEN_SECRET, 
        config.REFRESH_TOKEN_EXPIRY || "10d"
    );
};


// Verify Refresh Token helper
export const verifyRefreshToken = (refreshToken) => {
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    return decoded;
};

// Verify Access Token Helper
export const verifyAccessToken = (accessToken) => {
    return jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
};
