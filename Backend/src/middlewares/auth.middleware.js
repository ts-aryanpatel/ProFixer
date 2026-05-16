import * as tokenUtil from "../utils/token.util.js";
import providerModel from "../models/provider.model.js";

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
            console.log("Token Error: ", err);
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired access token"
            });
        }


        const provider = await providerModel.findById(decoded.id);

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        req.provider = provider;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};