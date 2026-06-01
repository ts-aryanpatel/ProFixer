import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Logger from "../utils/logger.js";

const logger = new Logger('Contact');

export const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
        throw new ApiError(400, "Name is required");
    }

    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }

    if (!message || !message.trim()) {
        throw new ApiError(400, "Message is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Validate message length
    if (message.length < 10) {
        throw new ApiError(400, "Message must be at least 10 characters long");
    }

    if (message.length > 1000) {
        throw new ApiError(400, "Message cannot exceed 1000 characters");
    }

    // TODO: Save to database or send email
    // For now, we just acknowledge receipt
    logger.info(`Contact form submission from ${email}`);

    res.status(200).json({
        success: true,
        message: "Your message has been received successfully. We will contact you soon!"
    });
});
