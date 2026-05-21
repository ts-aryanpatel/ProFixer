import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['customer'],
    },
    avatar: {
        type: String,
        default: 'https://placeholder.com/avatar.png',
    },
    addresses: [{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], 
                required: true,
            },
        },
    },],
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean, 
        default: false,
    },

}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;