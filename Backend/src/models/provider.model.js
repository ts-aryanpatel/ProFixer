import mongoose from "mongoose";


const providerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Please select your service category'],
        enum: ["Electrician", "Plumber", "Cleaning & Pest Control", "AC & Appliance Repair", "Carpenter", "Painter", "Salon & Grooming"]
    },
    skills: [
        { 
            type: String,
            trim: true
        }
    ],
    bio: {
        type: String,
        maxLength: [500, "Bio cannot exceed 500 characters"],
        default: ""
    },
    city: {
        type: String,
        required: [true, "City is required for local service"],
        trim: true
    },
    experience: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: "provider"
    }
}, { timestamps: true });


const providerModel = mongoose.model('provider', providerSchema);

export default providerModel;