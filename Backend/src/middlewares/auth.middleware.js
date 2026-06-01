import * as tokenUtil from "../utils/token.util.js";
import providerModel from "../models/provider.model.js";
import Customer from "../models/customer.model.js";
import Logger from "../utils/logger.js";

const logger = new Logger('Auth');

export const verifyProvider = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[ 1 ];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            });
        }

        let decoded; 
        try {
            decoded = tokenUtil.verifyAccessToken(token);
        } catch (err) {
            logger.warn('Token verification failed', err.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired access token"
            });
        }

        // Add timeout to prevent buffering issues
        const provider = await providerModel.findById(decoded.id).lean().exec().catch(err => {
            logger.error('Provider findById error', err.message);
            throw err;
        });

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        req.provider = provider;

        next();

    } catch (err) {
        logger.error('Auth middleware error', err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};


export const verifyCustomer = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[ 1 ];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            });
        }

        let decoded;
        try {
            decoded = tokenUtil.verifyAccessToken(token);
        } catch (err) {
            logger.warn('Token verification failed', err.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired access token"
            });
        }

        // Add .lean() for better performance when not modifying document
        const customer = await Customer.findById(decoded.id).lean().exec().catch(err => {
            logger.error('Customer findById error', err.message);
            throw err;
        });
        
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        req.customer = customer;

        next();


    } catch (err) {
        logger.error('Auth middleware error', err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};