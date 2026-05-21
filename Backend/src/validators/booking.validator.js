import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid MongoDB ObjectId format"
});

export const createBookingSchema = z.object({
    providerId: objectIdSchema,
    serviceId: objectIdSchema,

    timeSlot: z.object({
        date: z.string().datetime({ message: "Invalid date format. Use ISO string" }).or(z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date string" })),
        time: z.string().min(1, { message: "Time slot is required" })
    }),

    serviceAddress: z.object({
        street: z.string().trim().min(1, { message: "Street address is required" }),
        city: z.string().trim().min(1, { message: "City is required" }),
        state: z.string().trim().min(1, { message: "State is required" }),
        pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),
        label: z.string().trim().min(1, { message: "Address label (e.g., Home/Work) is required" }),
        coordinates: z.array(z.number()).length(2, { message: "Coordinates must have exactly 2 numbers [lgn, lat]" }).optional()
    }),
});