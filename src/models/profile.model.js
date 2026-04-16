const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    gender_probability: {
        type: Number,
        required: true
    },
    sample_size: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    age_group: {
        type: String,
    },
    country_id:{
        type: String,
        required: true
    },
    country_probability: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now().toISOString()
    }
});



module.exports = mongoose.model("Profile", profileSchema);