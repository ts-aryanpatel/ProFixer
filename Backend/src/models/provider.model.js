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
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        index: true
    },
    category: {
        type: String,
        required: [true, 'Please select your service category'],
        enum: ["Electrician", "Plumber", "Cleaning & Pest Control", "AC & Appliance Repair", "Carpenter", "Painter", "Salon & Grooming"],
        index: true
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
        trim: true,
        index: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' hamesha 'Point' hona chahiye
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    experience: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: "provider"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"],
        set: val => Math.round(val * 10) / 10 
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalJobsCompleted: {
        type: Number,
        default: 0,
        min: [0, "Jobs completed cannot be negative"]
    }
}, { timestamps: true });


const providerModel = mongoose.model('Provider', providerSchema);

export default providerModel;