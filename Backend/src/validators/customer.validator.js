import { z } from "zod";

export const registerCustomerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters" )
        .max(50, "Name cannot exceed 50 characters" ),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email address format")
        .lowercase(),

    password: z
        .string({ required_error: "Password is required"})
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password cannot exceed 30 characters"),

    phone: z
        .string({ required_error: "Phone number is required" })
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number. Must be 10 digits and start with 6-9"),
});


export const loginCustomerSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .lowercase()
        .optional(),

    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
        .optional(),

    password: z
        .string({ required_error: "Password is required"})
        .min(6, "Password must be at least 6 characters"),
}).refine((data) => data.email || data.phone, {
    message: "Either email or phone is required to login",
    path: ["email"],
});