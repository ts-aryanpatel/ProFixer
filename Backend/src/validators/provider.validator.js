import { z } from "zod";

export const providerRegisterSchema = z.object({
    fullName: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" })
        .toLowerCase(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(20, { message: "Password cannot exceed 20 characters" }),

    phoneNumber: z
        .string({ required_error: "Phone Number is required" })
        .trim()
        .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),

    category: z.enum(
        ["Electrician", "Plumber", "Cleaning & Pest Control", "AC & Appliance Repair", "Carpenter", "Painter", "Salon & Grooming"],
        { message: "Please select a valid category" }
    ),
    city: z
        .string({ required_error: "City is required" })
        .trim()
        .min(2, { message: "City name is too short" })
});


export const providerLoginSchema = z.object({
    email: z.string().email().toLowerCase().optional(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/).optional(),
    password: z.string().min(1, "Password is required"),
}).refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
});


export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .trim()
        .optional(),

    city: z
        .string()
        .min(2, { message: "City name is too short" })
        .trim()
        .optional(),

    skills: z
        .array(z.string({ message: "Each skill must be a string"}))
        .optional(),

    bio: z
        .string()
        .max(200, { message: "Bio cannot exceed 200 characters" })
        .trim()
        .optional(),

    experience: z
        .number({ invalid_type_error: "Experience must be a number"})
        .min(0, { message: "Experience cannot be negative" })
        .max(50, { message: "Please enter a valid experience" })
        .optional(),

    category: z
        .string()
        .trim()
        .optional(),

    coordinates: z
        .array(z.number({ invalid_type_error: "Each coordinate must be a number" }))
        .length(2, { message: "Coordinates must contain exactly 2 numbers [longitude, latitude]" })
        .optional(),
        
}).strict({ message: "Extra or unexpected fields are not allowed" });


export const changePasswordSchema = z.object({
    password: z
        .string({ required_error: "Old password is required" })
        .min(6, { message: "Old password must be atleast 6 characters" }),

    newPassword: z
        .string({ required_error: "New password is required" })
        .min(6, { message: "New password must be atleast 6 characters"})
}).refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"]
});