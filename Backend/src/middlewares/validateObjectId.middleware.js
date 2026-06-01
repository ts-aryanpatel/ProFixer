import { isValidObjectId } from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to validate MongoDB ObjectId in request parameters
 * @param {string} paramName - Name of the parameter to validate (e.g., 'id', 'providerId')
 */
export const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: `${paramName} parameter is required`
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format. Must be a valid MongoDB ID`
            });
        }

        next();
    };
};

/**
 * Middleware to validate multiple ObjectId parameters
 * @param {string[]} paramNames - Array of parameter names to validate
 */
export const validateMultipleObjectIds = (paramNames) => {
    return (req, res, next) => {
        for (const paramName of paramNames) {
            const id = req.params[paramName];
            
            if (id && !isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${paramName} format. Must be a valid MongoDB ID`
                });
            }
        }

        next();
    };
};

export default { validateObjectId, validateMultipleObjectIds };
