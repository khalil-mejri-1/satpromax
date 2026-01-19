const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
    formDetails: [{
        label: String,
        value: String
    }],
    issueType: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
