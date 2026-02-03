const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        subCategory: String,
        description: String,
        descriptionGlobal: String,
        extraSections: [
            {
                title: String,
                content: String,
                items: [
                    {
                        type: { type: String },
                        content: String
                    }
                ]
            }
        ],
        sku: String,
        tags: String,
        metaTitle: String,
        metaDescription: String,
        resolution: String,
        region: String,
        downloadLink: String,
        googlePlayLink: String,
        gallery: [String],
        promoPrice: String,
        promoStartDate: Date,
        promoEndDate: Date,
        slug: { type: String, unique: true, sparse: true },
        hasDelivery: { type: Boolean, default: false },
        deliveryPrice: String,
        inStock: { type: Boolean, default: true },
        hasTest: { type: Boolean, default: false },
        hasBouquets: { type: Boolean, default: false },
        selectedBouquets: [String],
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        seoH1: String,
        seoSubheadings: [{ level: String, text: String }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema, "products");
