import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

import ReviewCarousel from '../components/ReviewCarousel';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://satpromax.com/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  // Helper to filter products by category
  const getProductsByCategory = (category) => {
    // Case-insensitive check just in case
    return products.filter(p => p.category && p.category.toLowerCase().includes(category.toLowerCase()));
  };

  // Filter into categories
  const iptvProducts = getProductsByCategory('IPTV');
  const boxProducts = getProductsByCategory('Box');
  const streamingProducts = getProductsByCategory('Streaming');
  const giftCardProducts = getProductsByCategory('Gift Card');
  const softwareProducts = getProductsByCategory('Software');
  const gamingProducts = getProductsByCategory('Gaming');
  const musicProducts = getProductsByCategory('Music');

  return (
    <div className="home-page">
      <Header />
      <Hero />

      <ProductSection title="IPTV Premium" products={iptvProducts} loading={loading} categoryLink="/category/iptv-sharing" />
      <ProductSection title="Box Android Et Recepteur" products={boxProducts} loading={loading} categoryLink="/category/box-android" />
      <ProductSection title="Streaming" products={streamingProducts} loading={loading} categoryLink="/category/streaming" />
      <ProductSection title="Gaming" products={gamingProducts} loading={loading} categoryLink="/category/gaming" />
      <ProductSection title="Musique" products={musicProducts} loading={loading} categoryLink="/category/music" />
      <ProductSection title="Cartes Cadeaux" products={giftCardProducts} loading={loading} categoryLink="/category/gift-card" />
      <ProductSection title="Logiciels" products={softwareProducts} loading={loading} categoryLink="/category/software" />

      <ReviewCarousel />

      {/* Promo Banner Section (Generic 3 images from image 4) */}
      <section className="promo-banners container mt-10">
        <div className="promo-banner-card bg-streaming ">
          Abonnement Streaming
        </div>
        <div className="promo-banner-card bg-sharing">
          Abonnement Sharing
        </div>
        <div className="promo-banner-card bg-software">
          Logiciels
        </div>
      </section>

      <Footer />
    </div>
  )
}
