import mongoose from 'mongoose';
import Booking from "../models/booking.model.js";
import Customer from "../models/customer.model.js";
import Provider from "../models/provider.model.js";
import Service from "../models/service.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const createBooking = asyncHandler(async (req, res) => {
    const customerId = req.customer._id;
    const { providerId, serviceId, timeSlot, serviceAddress, } = req.body;

    if (customerId.toString() === providerId.toString()) {
        throw new ApiError(400, "You cannot book your own service.")
    }

    const bookingDate = new Date(timeSlot.date);
    if (bookingDate < new Date()) {
        throw new ApiError(400, "Cannot book a service for a past date. Please select a valid date.");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const providerExists = await Provider.findById(providerId).session(session);
        const serviceExists = await Service.findById(serviceId).session(session);

        if (!providerExists || !serviceExists) {
            throw new ApiError(404, "The requested provider or service does not exist.");
        }

        if (serviceExists.providerId.toString() !== providerId.toString()) {
            throw new ApiError(400, "The selected service does not belong to the specified provider.");
        }

        const customerConflict = await Booking.findOne({
            customerId,
            providerId,
            serviceId,
            "timeSlot.date": timeSlot.date,
            "timeSlot.time": timeSlot.time,
            status: { $in: ['pending', 'accepted', 'in-progress'] }
        }).session(session);

        if (customerConflict) {
            throw new ApiError(400, "You already have a booking for this service at the selected time slot.");
        }

        const providerConflict = await Booking.findOne({
            providerId,
            "timeSlot.date": timeSlot.date,
            "timeSlot.time": timeSlot.time,
            status: { $in: ['accepted', 'in-progress'] }
        }).session(session);

        if (providerConflict) {
            throw new ApiError(400, "The provider is not available at the selected time slot. Please choose a different time.");
        }

        const newBooking = await Booking.create([{
            customerId,
            providerId,
            serviceId,
            timeSlot,
            serviceAddress,
            status: 'pending',
            paymentStatus: 'pending',
            billAmount: 0
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Booking requested successfully. Waiting for provider approval.",
            data: newBooking[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

});


export const getCustomerBookings = asyncHandler(async (req, res) => {

    const customerId = req.customer._id;
    
    // Get pagination parameters from query
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // Max 50 items per page
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await Booking.countDocuments({ customerId });

    const bookings = await Booking.find({ customerId })
        .populate("providerId", "fullName email phoneNumber")
        .populate("serviceId", "name category price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: bookings.length === 0 ? "No bookings found" : "Customer bookings fetched successfully.",
        data: bookings,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: skip + limit < total,
            hasPrevPage: page > 1
        }
    });
});


export const cancelBookingByCustomer = asyncHandler(async (req, res) => {

    const customerId = req.customer._id;

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.customerId.toString() !== customerId.toString()) {
        throw new ApiError(403, "You do not have permission to cancel this booking.");
    }

    if (['in-progress', 'completed', 'rejected', 'cancelled'].includes(booking.status)) {
        throw new ApiError(400, `Cannot cancel booking because it is already ${booking.status}.`);
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
        success: true,
        message: "Booking cancelled successfully.",
        data: booking
    });
});


export const getProviderBookings = asyncHandler(async (req, res) => {
    const providerId = req.provider._id;

    if (!providerId) {
        throw new ApiError(400, "Provider ID is required.");
    }

    const bookings = await Booking.find({ providerId })
        .populate("customerId", "name email phone")
        .populate("serviceId", "name category price description")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Provider bookings fetched successfully.",
        count: bookings.length,
        data: bookings
    });
});


export const updateBookingStatusByProvider = asyncHandler(async (req, res) => {
    const providerId = req.provider._id;
    const { bookingId } = req.params;
    const { status, billAmount, paymentStatus } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.providerId.toString() !== providerId.toString()) {
        throw new ApiError(401, "You do not have permission to update this booking.");
    }

    if (['completed', 'cancelled', 'rejected'].includes(booking.status)) {
        throw new ApiError(400, `Cannot update status. The booking is already ${booking.status}.`);
    }

    const validStatuses = ['accepted', 'rejected', 'in-progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status type.");
    }

    if (status) {
        booking.status = status;
    }

    if (status === 'completed') {
        if (!billAmount || billAmount <= 0) {
            throw new ApiError(400, "Please provide a valid bill amount to complete the booking.");
        }
        booking.billAmount = billAmount;

        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
    }

    await booking.save();

    res.status(200).json({
        success: true,
        message: `Booking status updated to '${status}' successfully.`,
        data: booking
    });
});