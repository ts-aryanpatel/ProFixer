import Customer from "../models/customer.model.js";
import tokenModel from "../models/token.model.js";
import * as tokenUtil from "../utils/token.util.js";
import * as tokenTx from "../utils/tokenTransaction.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/cookieConfig.js";

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};


export const registerCustomer = asyncHandler( async (req, res) => {

    const { name, email, password, phone } = req.body;

    const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (existingCustomer) {
        throw new ApiError(400, "Email or phone already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
        name,
        email,
        password: hashedPassword,
        phone
    });

    res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        data: {
            id: customer._id,
            name: customer.name,
            role: customer.role,
            email: customer.email
        },
    });
});


export const loginCustomer = asyncHandler( async (req, res) => {

    const { email, phone, password } = req.body;

    const customer = await Customer.findOne({ $or: [{ email: email || '' }, { phone: phone || '' }] }).select('+password');

    if (!customer) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (customer.isActive === false) {
        throw new ApiError(403, "Your account has been deactivated. Please contact support to reactivate it.");
    }

    const isMatchPassword = await bcrypt.compare(password, customer.password);
    if (!isMatchPassword) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = tokenUtil.generateAccessToken({ id: customer._id, role: customer.role });
    const refreshToken = tokenUtil.generateRefreshToken(customer._id);

    const hashedRefreshToken = hashToken(refreshToken);

    await tokenModel.create({
        userId: customer._id,
        onModel: 'customer',
        refreshTokenHash: hashedRefreshToken,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
        success: true,
        message: "Customer logged in successfully",
        accessToken,
        data: {
            id: customer._id,
            name: customer.name,
            avatar: customer.avatar,
            role: customer.role,
            email: customer.email
        },
    });
});

export const refreshToken = asyncHandler( async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is missing");
    }

    let decoded;
    try {
        decoded = tokenUtil.verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const hashRefreshToken = hashToken(refreshToken);
    
    // Use transaction for atomic token rotation
    try {
        const storedToken = await tokenTx.rotateTokenWithTransaction(
            decoded.id,
            hashRefreshToken,
            hashToken(tokenUtil.generateRefreshToken(decoded.id)),
            tokenModel
        );

        const accessToken = tokenUtil.generateAccessToken({ id: storedToken.userId, role: storedToken.onModel });
        const newRefreshToken = tokenUtil.generateRefreshToken(decoded.id);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Token rotated successfully",
            accessToken
        });

    } catch (err) {
        throw new ApiError(401, err.message || "Token rotation failed");
    }

});


export const logout = asyncHandler( async (req, res) => {

    const customer = req.customer;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        throw new ApiError(401, "Token not found");
    }

    const hashRefreshToken = hashToken(refreshToken);
    
    // Use transaction to atomically revoke token
    try {
        await tokenTx.revokeTokenWithTransaction(customer._id, hashRefreshToken, tokenModel);
    } catch (err) {
        // Even if revocation fails, clear the cookie
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        throw new ApiError(500, "Logout failed");
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(200).json({
        success: true,
        message: 'Customer logged out successfully'
    });
});


export const logoutAll = asyncHandler( async (req, res) => {

    const customer = req.customer;

    await tokenModel.updateMany({ userId: customer._id, revoked: false }, { $set: { revoked: true }});

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.status(200).json({
        success: true,
        message: "All devices logged out successfully"
    });
});