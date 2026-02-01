
/**
 * Helper utility to generate JSON-LD schemas
 */

// Generate Organization Schema
export const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Satpromax",
    "url": "https://Satpromax.com",
    "logo": "https://Satpromax.com/logo.png",
    "sameAs": [
        "https://www.facebook.com/Satpromax",
        "https://www.instagram.com/Satpromax",
        // Add other social links here
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+21697496300",
        "contactType": "customer service"
    }
});

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
    }))
});

// Generate Product Schema
export const generateProductSchema = (product) => {
    if (!product) return null;

    const isPromo = product.promoPrice && new Date(product.promoEndDate) > new Date();
    const price = isPromo ? product.promoPrice : product.price; // Ensure numerical value in real usage

    // Clean price string if it contains currency symbols (e.g. "50 DT" -> 50)
    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));

    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": Array.isArray(product.gallery) && product.gallery.length > 0 ? [product.image, ...product.gallery] : [product.image],
        "description": product.description || `Acheter ${product.name} chez Satpromax.`,
        "sku": product.sku || product._id || product.id,
        "mpn": product.sku || product._id || product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Satpromax"
        },
        "offers": {
            "@type": "Offer",
            "url": typeof window !== "undefined" ? window.location.href : `https://Satpromax.com/product/${product.slug}`,
            "priceCurrency": "TND", // Adjust currency as needed
            "price": numericPrice,
            "priceValidUntil": product.promoEndDate || "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Satpromax"
            }
        },
        "aggregateRating": product.reviews && product.reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1),
            "reviewCount": product.reviews.length
        } : {
            // Default rating if none exist to prevent rich result errors (optional, use with caution)
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "1"
        }
    };
};

// Generate Article Schema
export const generateArticleSchema = (article) => {
    if (!article) return null;
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": typeof window !== "undefined" ? window.location.href : article.url
        },
        "headline": article.title,
        "image": article.image ? [article.image] : [],
        "datePublished": article.createdAt || new Date().toISOString(),
        "dateModified": article.updatedAt || new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": article.author || "SatpromaxTeam"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Satpromax",
            "logo": {
                "@type": "ImageObject",
                "url": "https://Satpromax.com/logo.png"
            }
        },
        "description": article.excerpt || article.description
    };
};
