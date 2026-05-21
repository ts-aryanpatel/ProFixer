import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Service name is require'],
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, "Service description is required"],
        maxLength: [500, "Description cannot be more than 500 characters"]
    },
    basePrice: {
        type: Number,
        required: [true, "Please provide a starting price"],
        min: [0, "Price cannot be negative"]
    },
    duration: {
        type: String,
        default: "As per requirement"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

serviceSchema.index({ providerId: 1, category: 1});

const serviceModel = mongoose.model('Service', serviceSchema);

export default serviceModel;