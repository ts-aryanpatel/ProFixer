import * as tokenUtil from "../utils/token.util.js";
import * as tokenTx from "../utils/tokenTransaction.js";
import bcrypt from "bcryptjs";
import providerModel from "../models/provider.model.js";
import tokenModel from "../models/token.model.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const register = asyncHandler(async (req, res) => {

    const { fullName, email, password, phoneNumber, category, city } = req.body;

    const isAlreadyExists = await providerModel.findOne({ $or: [{ email }, { phoneNumber }] });

    if (isAlreadyExists) {
       throw new ApiError(400, "Provider with this email or phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const provider = await providerModel.create({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        category,
        city
    });

    const refreshToken = tokenUtil.generateRefreshToken(provider._id);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await tokenModel.create({
        userId: provider._id,
        onModel: 'provider',
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[ 'user-agent' ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = tokenUtil.generateAccessToken({ id: provider._id });

    res.status(201).json({
        success: true,
        message: "Provider registered successfully",
        data: {
            id: provider._id,
            email: provider.email,
            fullName: provider.fullName
        },
        accessToken
    });
});

export const login = asyncHandler(async (req, res) => {
    
    const { email, phoneNumber, password } = req.body;
    const provider = await providerModel.findOne({
        $or :[
            { email },
            { phoneNumber }
        ]
    });

    if (!provider || !(await bcrypt.compare(password, provider.password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const refreshToken = tokenUtil.generateRefreshToken(provider._id);
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await tokenModel.create({
        userId: provider._id,
        onModel: 'provider',
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[ 'user-agent' ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });    

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });        

    const accessToken = tokenUtil.generateAccessToken({id: provider._id, role: provider.role});

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
            id: provider._id,
            email: provider.email,
            fullName: provider.fullName
        },
        accessToken
    });
});

export const refreshToken = asyncHandler(async(req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    let decoded;
    try {
        decoded = tokenUtil.verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new ApiError(401, "Invalid or Expired refresh token");
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const newRefreshToken = tokenUtil.generateRefreshToken(decoded.id);
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    // Use transaction for atomic token rotation
    try {
        const session = await tokenTx.rotateTokenWithTransaction(
            decoded.id,
            refreshTokenHash,
            newRefreshTokenHash,
            tokenModel
        );

        const accessToken = tokenUtil.generateAccessToken(decoded);

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

export const logout = asyncHandler (async (req, res) => {
    
    const provider = req.provider;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        throw new ApiError(401, "Token not found");
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');
    
    // Use transaction to atomically revoke token
    try {
        await tokenTx.revokeTokenWithTransaction(provider._id, refreshTokenHash, tokenModel);
    } catch (err) {
        // Even if revocation fails, clear the cookie
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        throw new ApiError(500, "Logout failed");
    }

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

export const logoutAll = asyncHandler(async (req, res) => {
    const provider = req.provider;

    await tokenModel.updateMany({userId: provider._id, revoked: false }, { $set: { revoked: true }});

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