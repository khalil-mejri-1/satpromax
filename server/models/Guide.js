const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String }, // Introduction text
    contentFontSize: { type: String, default: "1.1rem" },
    sections: [{
        title: { type: String, trim: true },
        titleFontSize: { type: String, default: "1.5rem" },
        content: { type: String }, // Text under section title
        contentFontSize: { type: String, default: "1.1rem" },
        image: { type: String, trim: true } // Optional image for section
    }],
    excerpt: { type: String, trim: true },
    titleFontSize: { type: String, default: "2.2rem" }, // Hero title size
    image: { type: String, trim: true },
    category: { type: String, default: "Guides d'installation" },
    author: { type: String, default: "Satpromax" },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Guide', GuideSchema);
