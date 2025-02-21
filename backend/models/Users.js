const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    profilePic: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    
    // Array of recipient user IDs
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("User", userSchema);
