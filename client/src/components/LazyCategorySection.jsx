import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';
import { slugify } from '../utils/slugify';
import ProductSection from './ProductSection';

export default function LazyCategorySection({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If section is intersecting and we haven't fetched yet
        if (entries[0].isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchProducts();
        }
      },
      {
        rootMargin: '50px', // Fetch only when very close to viewport so requests don't all fire at once
        threshold: 0
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasFetched, category.name]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch 15 newest products for this category in order
      const res = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(category.name)}&limit=15&sort=newest`);
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(`Failed to fetch products for category ${category.name}`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={sectionRef} style={{ minHeight: '350px' }}>
      {(!hasFetched || loading) ? (
        <ProductSection
          title={category.name}
          products={[]}
          loading={true}
          categoryLink={`/${slugify(category.name)}`}
        />
      ) : (
        products.length > 0 ? (
          <ProductSection
            title={category.name}
            products={products}
            loading={false}
            categoryLink={`/${slugify(category.name)}`}
          />
        ) : null
      )}
    </div>
  );
}
