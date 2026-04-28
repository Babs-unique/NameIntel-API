import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Date,
        default: Date.now
    },
    is_revoked: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("Token", tokenSchema);