import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

import ReviewCarousel from '../components/ReviewCarousel';

import { slugify } from '../utils/slugify';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promoCards, setPromoCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper to shuffle array
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Fetch Products
    const fetchProducts = fetch('https://satpromax.com/api/products').then(res => res.json());
    // Fetch Settings (Categories & Promos)
    const fetchSettings = fetch('https://satpromax.com/api/settings').then(res => res.json());

    Promise.all([fetchProducts, fetchSettings])
      .then(([productsData, settingsData]) => {
        if (productsData.success) {
          // Shuffle products every time the page refreshes
          setProducts(shuffleArray(productsData.data));
        }
        if (settingsData.success && settingsData.data) {
          if (settingsData.data.categories) setCategories(settingsData.data.categories);
          if (settingsData.data.promoCards) setPromoCards(settingsData.data.promoCards);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  // Helper to filter products by category
  const getProductsByCategory = (categoryName) => {
    if (!categoryName) return [];
    return products.filter(p => p.category && p.category.toLowerCase() === categoryName.toLowerCase());
  };

  return (
    <div className="home-page">
      <Header />
      <Hero />

      {categories.map((category, index) => {
        // Try exact match first, then partial if needed, but exact is better for DB driven categories
        // actually, let's allow partial match if exact fails or just be loose?
        // The user manually filtered 'Box' for 'Box Android'. 
        // If DB category is 'Box Android' and product is 'Box Android', exact works.
        // Let's stick to a robust check: include check is safer for slight variations.
        const categoryProducts = products.filter(p =>
          p.category && (
            p.category.toLowerCase() === category.name.toLowerCase() ||
            p.category.toLowerCase().includes(category.name.toLowerCase()) ||
            category.name.toLowerCase().includes(p.category.toLowerCase())
          )
        );

        // Don't show empty sections if not loading (optional, but cleaner)
        // actually user might want to see empty sections to know they exist? 
        // Standard is usually hide if empty. But let's show all for now as requested "display categories".

        return (
          <ProductSection
            key={index}
            title={category.name}
            products={categoryProducts}
            loading={loading}
            categoryLink={`/category/${slugify(category.name)}`}
          />
        );
      })}

      <ReviewCarousel />

      {/* Promo Banner Section (Dynamic) */}
      <section className="promo-banners container mt-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {promoCards && promoCards.length > 0 ? (
          promoCards.map((card, idx) => (
            <div
              key={idx}
              className="promo-banner-card"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => window.location.href = `/category/${slugify(card.title)}`}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)', // Darker overlay for readability
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                transition: 'background 0.3s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
              >
                <h3 style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '800',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  margin: 0
                }}>
                  {card.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          /* Fallback if no promo cards configured */
          <div style={{ display: 'contents' }}>
            <div className="promo-banner-card bg-streaming">Abonnement Streaming</div>
            <div className="promo-banner-card bg-sharing">Abonnement Sharing</div>
            <div className="promo-banner-card bg-software">Logiciels</div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
