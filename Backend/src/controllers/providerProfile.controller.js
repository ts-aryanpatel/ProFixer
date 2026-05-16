import providerModel from "../models/provider.model.js";
import bcrypt from "bcryptjs";
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {

    const provider = req.provider;

    if (!provider) {
        throw new ApiError(404, "Provider not found")
    }

    res.status(200).json({
        success: true,
        message: "Profile Data fetched successfully",
        data: {
            id: provider._id,
            fullName: provider.fullName,
            email: provider.email,
            phoneNumber: provider.phoneNumber,
            category: provider.category,
            city: provider.city,
            experience: provider.experience,
            skills: provider.skills,
            bio: provider.bio,
            isVerified: provider.isVerified,
            isOnline: provider.isOnline,
            createdAt: provider.createdAt,
            role: provider.role
        }
    });
});

export const updateProfile = asyncHandler(async (req, res) => {

    const providerId = req.provider._id;

    if (Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No valid fields provided for update")
    }

    const updateProvider = await providerModel.findByIdAndUpdate(
        providerId,
        { $set: req.body },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!updateProvider) {
        throw new ApiError(404, "Provider profile not found")
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updateProvider
    });

});

export const isOnline = asyncHandler(async (req, res) => {

    const providerId = req.provider._id;
    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
        throw new ApiError(400, "isOnline status must be a boolean (true/false)")
    }

    const updateProvider = await providerModel.findByIdAndUpdate(
        providerId,
        { isOnline },
        { new: true }
    ).select("isOnline");

    if (!updateProvider) {
        throw new ApiError(404, "Provider not found");
    }

    res.status(200).json({
        success: true,
        message: `Status updated to ${updateProvider.isOnline ? "Online" : "Offline"}`,
        data: { isOnline: updateProvider.isOnline }
    });

});

export const changePassword = asyncHandler(async (req, res) => {

    const providerId = req.provider._id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const provider = await providerModel.findById(providerId).select("+password");

    if (!provider) {
        throw new ApiError(404, "Provider not found");
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await providerModel.findByIdAndUpdate(
        provider._id,
        { password: hashedNewPassword },
    );

    res.status(200).json({
        success: true,
        message: "Password changed successfully. Please login again if needed."
    });

});