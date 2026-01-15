const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        description: String,
        descriptionGlobal: String,
        extraSections: [
            {
                title: String,
                content: String
            }
        ],
        sku: String,
        tags: String,
        metaTitle: String,
        metaDescription: String,
        resolution: String,
        region: String,
        downloadLink: String,
        gallery: [String],
        promoPrice: String,
        promoStartDate: Date,
        promoEndDate: Date,
        slug: { type: String, unique: true, sparse: true },
        hasDelivery: { type: Boolean, default: false },
        deliveryPrice: String,
        inStock: { type: Boolean, default: true }
    },
    { timestamps: true }
);

// 👇 هنا الحل
module.exports = mongoose.model("Product", productSchema, "products");
