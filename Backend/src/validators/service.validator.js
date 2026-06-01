import { z } from 'zod';

export const addServiceSchema = z.object({
    name: z
        .string({ required_error: "Service name is required" })
        .trim()
        .min(3, { message: "Service name must be at least 3 characters" }),

    description: z
        .string({ required_error: "Service description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters" })
        .max(500, { message: "Description cannot exceed 500 characters" }),

    basePrice: z
        .number({ required_error: "Base price is required", invalid_type_error: "Price must be a number" })
        .min(0, { message: "Price cannot be negative" }),

    duration: z
        .string()
        .trim()
        .optional()
}).strict({ message: "Extra fields are not allowed" });


export const updateServiceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name must be at least 3 characters"})
        .optional(),

    description: z
        .string()
        .trim()
        .min(10, { message: "Description must be at least 10 characters" })
        .max(500, { message: "Description cannot exceed 500 characters" })
        .optional(),

    basePrice: z
        .number({ invalid_type_error: "Price must be a number" })
        .min(0, { message: "Price cannot be negative"})
        .optional(),

    duration: z
        .string()
        .trim()
        .optional()
}).strict({ message: "Extra fields are not allowed"});

export default { addServiceSchema, updateServiceSchema };