import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    github_id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar_url: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['analyst', 'admin'],
        default: 'analyst'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    last_login_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model("User", userSchema);
export default User;