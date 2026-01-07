const mongoose = require('mongoose');

const GeneralSettingsSchema = new mongoose.Schema({
    paymentModes: [mongoose.Schema.Types.Mixed],
    deviceChoices: [{
        type: String,
        trim: true
    }],
    categories: [mongoose.Schema.Types.Mixed],
    whatsappNumber: { type: String, trim: true, default: "21697496300" }
}, { timestamps: true });

// Ensure only one document exists usually
module.exports = mongoose.model('GeneralSettings', GeneralSettingsSchema);
