const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'client', enum: ['client', 'admin'] },
    resetCode: String,
    resetCodeExpires: Date,
    // 2FA fields
    twoFactorSecret: { type: String, default: null },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorTempSecret: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
