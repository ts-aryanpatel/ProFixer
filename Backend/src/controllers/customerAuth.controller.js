import Customer from "../models/customer.model.js";
import tokenModel from "../models/token.model.js";
import * as tokenUtil from "../utils/token.util.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ref } from "process";

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

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Customer logged in successfully",
        accessToken,
        data: {
            id: customer._id,
            name: customer.name,
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
    const storedToken = await tokenModel.findOne({ userId: decoded.id, refreshTokenHash: hashRefreshToken });
    
    if (!storedToken || storedToken.revoked) {
        throw new ApiError(401, "Token is invalid, expired or revoked");
    }

    const accessToken = tokenUtil.generateAccessToken({ id: storedToken.userId, role: storedToken.onModel });
    const newRefreshToken = tokenUtil.generateRefreshToken(decoded.id);
    const hashedNewRefreshToken = hashToken(newRefreshToken);

    storedToken.refreshTokenHash = hashedNewRefreshToken;
    await storedToken.save();

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

});


export const logout = asyncHandler( async (req, res) => {

    const customer = req.customer;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Token not found");
    }

    const hashRefreshToken = hashToken(refreshToken);
    const session = await tokenModel.findOne({ userId: customer._id, refreshTokenHash: hashRefreshToken });

    if (!session) {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        throw new ApiError(404, "Session not found");
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken", {
        httpOnly: true, 
        secure: true, 
        sameSite: "strict" 
    });

    res.status(200).json({
        success: true,
        message: 'Provider logged out successfully'
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