import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    timeSlot: {
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    serviceAddress: {
        street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        pincode: { type: String, required: true },
        label: { type: String, required: true },
        coordinates: { type: [Number] }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    billAmount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });


const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;