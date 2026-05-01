import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("Token", tokenSchema);