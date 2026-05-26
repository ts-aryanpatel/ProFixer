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

export const searchServicesAndProviders = asyncHandler(async (req, res) => {
    const { city, query } = req.query;

    if (!city) {
        throw new ApiError(400, "City selection is required for local search");
    }

    // -----------------------------------------------------------------
    // FIX: Fuzzy Search, Spaces, Hyphens & Special Characters Handling
    // -----------------------------------------------------------------
    let queryRegex = null;
    const cleanQuery = query ? query.trim() : "";

    if (cleanQuery !== "") {
        // 1. Saare special characters (hyphen, quotes, brackets) ko safe/escape karo
        let sanitizedQuery = cleanQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // 2. Agar user ne 'aryan kumar' ya 'aryankumar' search kiya hai,
        // toh hum har character ke beech me optional spaces/hyphens allowed kar denge.
        // Isse 'aryankumar' search karne par 'Aryan Kumar' bhi match ho jayega.
        let fuzzyPattern = sanitizedQuery
            .split("")
            .map(char => char.trim() === "" ? "\\s*" : `${char}[\\s\\-_']*`)
            .join("");

        queryRegex = new RegExp(fuzzyPattern, 'i');
    }

    // Step 1: Us city ke saare ONLINE providers ki list nikal lo base reference ke liye
    const localOnlineProviders = await providerModel.find({
        city: { $regex: new RegExp(city, 'i') },
        // isVerified: true,
        // isOnline: true
    }).select("fullName email phoneNumber category skills bio city averageRating totalReviews totalJobsCompleted isVerified");

    const localProviderIds = localOnlineProviders.map(p => p._id);

    let matchedProviders = [];
    let matchedServices = [];

    // Agar query keyword hai, toh dynamic smart matching chalao
    if (cleanQuery !== "" && queryRegex) {

        // A) Services me search karo (Jo sirf local providers ki hon)
        matchedServices = await serviceModel.find({
            providerId: { $in: localProviderIds },
            isActive: true,
            $or: [
                { name: { $regex: queryRegex } },
                { description: { $regex: queryRegex } }
            ]
        });

        // Services ke raste se providers ki IDs nikal lo
        const providerIdsFromServices = matchedServices.map(s => s.providerId.toString());

        // B) Providers me fuzzy search karo (Name, Category, Skills)
        const directlyMatchedProviders = localOnlineProviders.filter(provider => {
            return (
                provider.fullName.match(queryRegex) ||
                provider.category.match(queryRegex) ||
                (provider.skills && provider.skills.some(skill => skill.match(queryRegex)))
            );
        });

        // C) Dono tarike se mile providers ko combine karke duplicates hatao (Using Map)
        const combinedProvidersMap = new Map();
        
        // Pehle direct profile match wale add karo
        directlyMatchedProviders.forEach(p => combinedProvidersMap.set(p._id.toString(), p));
        
        // Fir jo service match ke raste se mile hain unhe add karo
        localOnlineProviders.forEach(p => {
            if (providerIdsFromServices.includes(p._id.toString())) {
                combinedProvidersMap.set(p._id.toString(), p);
            }
        });

        matchedProviders = Array.from(combinedProvidersMap.values());

    } else {
        // Agar query empty hai, toh us city ka sab kuch default pe de do
        matchedProviders = localOnlineProviders;
        matchedServices = await serviceModel.find({
            providerId: { $in: localProviderIds },
            isActive: true
        });
    }

    // Sorting: Verified aur top-rated professionals hamesha top par rahenge
    matchedProviders.sort((a, b) => (b.isVerified - a.isVerified) || (b.averageRating - a.averageRating));

    // Response send karein
    res.status(200).json({
        success: true,
        message: matchedProviders.length === 0 ? "No results found for your search" : "Search results fetched successfully",
        results: {
            providersCount: matchedProviders.length,
            servicesCount: matchedServices.length,
            providers: matchedProviders,
        }
    });
});
