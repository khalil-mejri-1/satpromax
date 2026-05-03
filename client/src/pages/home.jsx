import React, { useState, useEffect } from 'react';
import { API_BASE_URL, SITE_URL } from '../config';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import LazyCategorySection from '../components/LazyCategorySection';
import Footer from '../components/Footer';

import ReviewCarousel from '../components/ReviewCarousel';

import { slugify } from '../utils/slugify';
import TrendingMovies from '../components/TrendingMovies';

import SEO from '../components/SEO/SEO';

import { ShopContext } from '../context/ShopContext';

export default function Home() {
  const { homeData, loadingAppData } = React.useContext(ShopContext);
  const categories = homeData?.settings?.categories || [];
  const promoCards = homeData?.settings?.promoCards || [];
  const loading = loadingAppData;

  return (
    <div className="home-page">
      <SEO
        title="Accueil"
        description="Satpromax- Votre destination pour les meilleurs abonnements Streaming, IPTV, Gaming et Logiciels en Tunisie."
        canonical={SITE_URL}
      />
      <Header />
      <Hero />
      <TrendingMovies />

      {loading ? (
        /* Render 2-3 Skeleton Sections while loading */
        [1, 2].map((_, index) => (
          <ProductSection
            key={index}
            title="Chargement..."
            products={[]}
            loading={true}
          />
        ))
      ) : (
        categories.map((category, index) => (
          <LazyCategorySection 
            key={index} 
            category={category} 
            index={index} 
            initialProducts={homeData?.categoryMap?.[category.name] || []}
          />
        ))
      )}

      <ReviewCarousel />

      {/* Promo Banner Section (Dynamic) */}
      <section className="promo-banners container mt-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          /* Render 3 Skeleton Banners */
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="promo-banner-card skeleton" style={{ height: '200px', background: '#f1f5f9' }}></div>
          ))
        ) : promoCards && promoCards.length > 0 ? (
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
              onClick={() => window.location.href = `/${slugify(card.title)}`}
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
