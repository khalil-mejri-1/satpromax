import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { SITE_URL } from '../../config';
import { slugify } from '../../utils/slugify';
import Schema from './Schema';

const NavigationSchema = () => {
    // Explicit list based on USER request to influence Google Sitelinks
    const mainCategories = [
        { name: "Streaming", slug: "streaming" },
        { name: "Abonnement IPTV", slug: "abonnement-iptv" },
        { name: "Box Android Récepteurs tv", slug: "box-android-recepteurs-tv" },
        { name: "Gaming et Clés Digitales", slug: "gaming-et-cles-digitales" },
        { name: "Player Activation", slug: "player-activation" },
        { name: "Sharing", slug: "sharing" },
        { name: "beIN Sports Officiel", slug: "bein-sports-officiel" },
        { name: "Abonnement TOD", slug: "abonnement-tod" },
        { name: "cartes Gaming", slug: "cartes-gaming" }
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": mainCategories.map((cat, index) => ({
            "@type": "SiteNavigationElement",
            "position": index + 1,
            "name": cat.name,
            "url": `${SITE_URL}/${cat.slug}`
        }))
    };

    return <Schema schema={schema} />;
};

export default NavigationSchema;
