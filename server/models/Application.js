const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true }, // URL to icon
    downloadLink: { type: String, required: true },
    description: { type: String, trim: true },
    os: { type: String, enum: ['Android', 'Windows', 'iOS', 'Other'], default: 'Android' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
