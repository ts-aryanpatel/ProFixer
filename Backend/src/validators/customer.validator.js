import { z } from "zod";

export const registerCustomerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email address format")
        .lowercase(),

    password: z
        .string({ required_error: "Password is required" })
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
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
}).refine((data) => data.email || data.phone, {
    message: "Either email or phone is required to login",
    path: ["email"],
});


export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),

    avatar: z
        .string()
        .url("Invalid avatar URL format")
        .optional()
        .or(z.literal("")),

    addresses: z
        .array(
            z.object({
                label: z.string().trim().min(1, "Address label is required (e.g., Home, Work, Other"),
                street: z.string().trim().min(1, "Street/Locality is required"),
                city: z.string().trim().min(1, "City is required"),
                state: z.string().trim().min(1, "State is required"),
                pincode: z
                    .string()
                    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
                coordinates: z
                    .array(z.number())
                    .length(2, "Coordinates must contain exactly longitude and latitude"),

            })
        )
        .min(1, "At least one address details must be provided if updating addresses")
        .optional()
}).strict();

export const changePasswordSchema = z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z
        .string({ required_error: "New password is required" })
        .min(6, "New password must be at least 6 characters long")
        .max(30, "New pasword cannot exceed 30 characters")
}).strict();