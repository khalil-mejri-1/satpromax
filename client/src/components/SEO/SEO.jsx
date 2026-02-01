import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Enhanced SEO Component for React
 * Handles dynamic meta tags, social media tags, and JSON-LD schemas
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
    const siteName = "Technoplus - SatProMax";
    const defaultDescription = "Découvrez les meilleurs abonnements Streaming, IPTV et Gaming chez satpromax. Abonnements Netflix, Shahid VIP, IPTV Premium et plus.";
    const defaultImage = "https://satpromax.com/og-image.jpg"; // Replace with your actual default OG image
    const baseUrl = "https://satpromax.com";

    // Ensure full URLs
    const fullImage = image && image.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`;
    const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`) : window.location.href;

    // Construct Title
    const pageTitle = title ? `${title} | ${siteName}` : siteName;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
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
            <meta name="twitter:creator" content="@satpromax" /> {/* Replace with actual handle if available */}
            <meta name="twitter:title" content={title || siteName} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* JSON-LD Schemas */}
            {schemas.map((schema, index) => (
                schema && (
                    <script key={index} type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                )
            ))}
        </Helmet>
    );
};

export default SEO;
