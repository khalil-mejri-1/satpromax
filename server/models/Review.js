const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Optional: link to product
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
