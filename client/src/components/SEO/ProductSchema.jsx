import { useEffect } from 'react';

/**
 * ProductSchema Component
 * Injects Schema.org Product JSON-LD into the head dynamically.
 * Compliant with Google Rich Results requirements.
 */
const ProductSchema = ({ product }) => {
    useEffect(() => {
        if (!product) return;

        // 1. Remove any existing product schema to avoid duplicates
        // This ensures we don't pile up scripts if the user navigates between products
        const existingScript = document.querySelector('script[data-type="product-schema"]');
        if (existingScript) {
            existingScript.remove();
        }

        // 2. Parse Price (Handle "12 DT" or "12.00" formats)
        // Removes non-numeric characters except dot
        const rawPrice = product.price ? String(product.price).replace(/[^0-9.]/g, '') : "0";

        // 3. Construct the Schema.org object (Strictly adhering to specs)
        const schemaData = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name || product.title,
            "description": product.description || "No description available.",
            "image": Array.isArray(product.images) ? product.images : [product.image].filter(Boolean),
            "sku": product.sku || product._id || "N/A",
            "brand": {
                "@type": "Brand",
                "name": product.brand || "Satpromax"
            },
            "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "TND", // Tunisian Dinar based on site context
                "price": rawPrice,
                "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition"
            }
        };

        // Optional: Add aggregateRating if reviews exist
        if (product.numReviews > 0 && product.rating) {
            schemaData.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.numReviews
            };
        }

        // 4. Inject script into <head>
        const script = document.createElement('script');
        script.type = "application/ld+json";
        script.setAttribute('data-type', 'product-schema'); // Tag for easy removal
        script.textContent = JSON.stringify(schemaData);
        document.head.appendChild(script);

        // 5. Cleanup on unmount or product change
        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [product]);

    return null;
};

export default ProductSchema;
