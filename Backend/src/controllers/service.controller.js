import providerModel from "../models/provider.model.js";
import serviceModel from "../models/service.model.js";
import { SERVICE_SUGGESTIONS } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const addServices = asyncHandler(async (req, res) => {

    const providerId = req.provider._id;
    const { name, description, basePrice, duration } = req.body;

    const provider = await providerModel.findById(providerId);

    if (!provider) {
        throw new ApiError(404, "Provider not found");
    }

    const existingService = await serviceModel.findOne({ providerId, name });
    if (existingService) {
        throw new ApiError(400, "You have already added this service");
    }

    const service = await serviceModel.create({
        providerId,
        name,
        category: provider.category,
        description,
        basePrice,
        duration
    });

    res.status(201).json({
        success: true,
        message: "Service Added successfully",
        service
    });

});

export const updateService = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const providerId = req.provider._id;

    if (Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No fields provided to update");
    }

    const updateService = await serviceModel.findOneAndUpdate(
        { _id: id, providerId },
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!updateService) {
        throw new ApiError(404, "Service not found or you're not authorized");
    }

    res.status(200).json({
        success: true,
        message: "Service updated successfully",
        service: updateService
    });

});

export const getAllServices = asyncHandler(async (req, res) => {

    const providerId = req.provider._id;

    const allServices = await serviceModel.find({ providerId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: allServices.length === 0 ? "No services found" : "All Services fetched successfully",
        count: allServices.length,
        allServices
    });

});

export const deleteService = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const providerId = req.provider._id;

    const deleteService = await serviceModel.findOneAndDelete(
        { _id: id, providerId },
    );

    if (!deleteService) {
        throw new ApiError(404, "Service not found or you're not authorized to delete it");
    }

    res.status(200).json({
        success: true,
        message: "Service Deleted Successfully"
    });

});

export const getServiceSuggestion = asyncHandler(async (req, res) => {

    const category = req.provider.category;

    if (!category) {
        throw new ApiError(400, "Please update your profile category first to get suggestions");
    }

    const cleanCategory = category.toLowerCase().trim();

    const suggestions = SERVICE_SUGGESTIONS[cleanCategory] || SERVICE_SUGGESTIONS[category] || [];

    res.status(200).json({
        success: true,
        category,
        suggestions
    });

});