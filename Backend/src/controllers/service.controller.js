import providerModel from "../models/provider.model.js";
import serviceModel from "../models/service.model.js";
import { SERVICE_SUGGESTIONS } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listResponse, resourceResponse } from "../utils/apiResponse.js";


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

    // Add limits to prevent ReDoS and memory issues
    const MAX_QUERY_LENGTH = 50;
    const MAX_RESULTS = 50;
    
    let queryRegex = null;
    const cleanQuery = query ? query.trim() : "";

    // Validate query length to prevent ReDoS attacks
    if (cleanQuery.length > MAX_QUERY_LENGTH) {
        throw new ApiError(400, `Search query cannot exceed ${MAX_QUERY_LENGTH} characters`);
    }

    if (cleanQuery !== "") {
        // Escape special characters to prevent ReDoS
        let sanitizedQuery = cleanQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // Create fuzzy pattern with length check
        let fuzzyPattern = sanitizedQuery
            .split("")
            .map(char => char.trim() === "" ? "\\s*" : `${char}[\\s\\-_']*`)
            .join("");

        queryRegex = new RegExp(fuzzyPattern, 'i');
    }

    // Step 1: Get providers from city with limit
    const localOnlineProviders = await providerModel.find({
        city: { $regex: new RegExp(city, 'i') }
    })
    .select("fullName email phoneNumber category skills bio city averageRating totalReviews totalJobsCompleted isVerified")
    .limit(MAX_RESULTS);

    const localProviderIds = localOnlineProviders.map(p => p._id);

    let matchedProviders = [];
    let matchedServices = [];

    if (cleanQuery !== "" && queryRegex) {
        // Search services with limit
        matchedServices = await serviceModel.find({
            providerId: { $in: localProviderIds },
            isActive: true,
            $or: [
                { name: { $regex: queryRegex } },
                { description: { $regex: queryRegex } }
            ]
        })
        .limit(MAX_RESULTS);

        const providerIdsFromServices = matchedServices.map(s => s.providerId.toString());

        // Filter providers matching query
        const directlyMatchedProviders = localOnlineProviders.filter(provider => {
            return (
                provider.fullName.match(queryRegex) ||
                provider.category.match(queryRegex) ||
                (provider.skills && provider.skills.some(skill => skill.match(queryRegex)))
            );
        });

        // Combine and deduplicate providers
        const combinedProvidersMap = new Map();
        directlyMatchedProviders.forEach(p => combinedProvidersMap.set(p._id.toString(), p));
        localOnlineProviders.forEach(p => {
            if (providerIdsFromServices.includes(p._id.toString())) {
                combinedProvidersMap.set(p._id.toString(), p);
            }
        });

        matchedProviders = Array.from(combinedProvidersMap.values()).slice(0, MAX_RESULTS);
    } else {
        // Return default results with limit
        matchedProviders = localOnlineProviders.slice(0, MAX_RESULTS);
        matchedServices = await serviceModel.find({
            providerId: { $in: localProviderIds },
            isActive: true
        })
        .limit(MAX_RESULTS);
    }

    // Sort by verification and rating
    matchedProviders.sort((a, b) => (b.isVerified - a.isVerified) || (b.averageRating - a.averageRating));

    res.status(200).json({
        success: true,
        message: matchedProviders.length === 0 ? "No results found for your search" : "Search results fetched successfully",
        data: {
            providers: matchedProviders,
            services: matchedServices
        },
        meta: {
            providersCount: matchedProviders.length,
            servicesCount: matchedServices.length
        }
    });
});
