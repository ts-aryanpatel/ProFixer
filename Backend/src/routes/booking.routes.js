import express from 'express';
import { verifyCustomer, verifyProvider } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import { createBookingSchema } from "../validators/booking.validator.js";
import {

    createBooking,
    getCustomerBookings,
    cancelBookingByCustomer,
    getProviderBookings,
    updateBookingStatusByProvider

} from "../controllers/booking.controller.js";

const router = express.Router();



//------------- CUSTOMER ---------------

// POST  /api/booking/customer/create
router.post("/customer/create", verifyCustomer, validate(createBookingSchema), createBooking);

// GET  /api/booking/customer/bookings
router.get("/customer/bookings", verifyCustomer, getCustomerBookings);

// PUT  /api/booking/customer/:bookingId
router.put("/customer/:bookingId", verifyCustomer, validateObjectId('bookingId'), cancelBookingByCustomer);



// ----------------- PROVIDER ---------------

// GET  /api/booking/provider/bookings
router.get("/provider/bookings", verifyProvider, getProviderBookings);

// PUT  /api/booking/provider/:bookingId
router.put("/provider/:bookingId", verifyProvider, validateObjectId('bookingId'), updateBookingStatusByProvider);


export default router;