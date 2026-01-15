const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String }, // Introduction text
    sections: [{
        title: { type: String, trim: true },
        content: { type: String }, // Text under section title
        image: { type: String, trim: true } // Optional image for section
    }],
    excerpt: { type: String, trim: true },
    image: { type: String, trim: true },
    category: { type: String, default: "Guides d'installation" },
    author: { type: String, default: "satpromax" },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Guide', GuideSchema);
