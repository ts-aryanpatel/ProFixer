import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['provider', 'customer']
    },
    refreshTokenHash: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
        default: 'unknown'
    },
    revoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, { timestamps: true });

const tokenModel = mongoose.model("Token", tokenSchema);

export default tokenModel;