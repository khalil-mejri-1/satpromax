import React from 'react';

/**
 * Enhanced SEO Component for React 19
 * Handles dynamic meta tags, social media tags, and JSON-LD schemas
 * Uses native React 19 metadata support
 */
const SEO = ({
    title,
    description,
    canonical,
    image,
    type = 'website',
    keywords,
    schemas = [], // Array of JSON-LD schema objects
    twitterCard = 'summary_large_image',
    noindex = false,
    ...props
}) => {
    const siteName = "Satpromax- Satpromax";
    const defaultDescription = "Découvrez les meilleurs abonnements Streaming, IPTV et Gaming chez Satpromax. Abonnements Netflix, Shahid VIP, IPTV Premium et plus.";
    const baseUrl = "https://Satpromax.com";

    // Ensure full URLs
    const fullImage = image && image.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`;
    const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) : window.location.href;

    // Construct Title
    const pageTitle = title ? `${title} | ${siteName}` : siteName;

    return (
        <>
            {/* Standard Meta Tags - Automatically hoisted to head in React 19 */}
            <title>{pageTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullCanonical} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={title || siteName} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:creator" content="@Satpromax" />
            <meta name="twitter:title" content={title || siteName} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* JSON-LD Schemas - Combined into @graph for better parsing */}
            {schemas.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": schemas.filter(s => !!s).map(s => {
                                // Remove individual @context to avoid redundancy in @graph
                                const { "@context": _, ...rest } = s;
                                return rest;
                            })
                        })
                    }}
                />
            )}
        </>
    );
};

export default SEO;
