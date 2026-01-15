const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread', enum: ['unread', 'read'] }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
