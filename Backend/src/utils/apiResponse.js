// Standardized API Response Utility
export class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

// Success Response with Optional Pagination
export const successResponse = (res, statusCode, data, message = "Success", pagination = null) => {
    const response = {
        success: true,
        message: message,
        data: data
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
};

// Error Response (already handled by ApiError, but for consistency)
export const errorResponse = (res, statusCode, message, error = null) => {
    const response = {
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
    };

    return res.status(statusCode).json(response);
};

// List Response with Pagination
export const listResponse = (res, statusCode, items, pagination, message = "List fetched successfully") => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: items,
        pagination: pagination
    });
};

// Single Resource Response
export const resourceResponse = (res, statusCode, resource, message = "Success") => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: resource
    });
};
