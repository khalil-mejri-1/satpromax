const mongoose = require('mongoose');

const GuideInquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    question: { type: String, required: true },
    articleTitle: { type: String, trim: true },
    articleSlug: { type: String, trim: true },
    status: { type: String, default: 'pending', enum: ['pending', 'replied'] }
}, { timestamps: true });

module.exports = mongoose.model('GuideInquiry', GuideInquirySchema);
