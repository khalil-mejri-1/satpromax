import React, { useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import './ProductSection.css';

export default function ProductSection({ title, products = [], loading = false, categoryLink }) {
    const scrollContainerRef = useRef(null);
    const { addToCart } = useContext(ShopContext);

    // State to track added status for animation per product (optional but good UX)
    // We'll use a local set of added IDs for simple UX feedback if needed, 
    // or just trigger the action. For now, we'll keep it simple or use a temporary state.
    // However, since we are mapping, we might need a separate component or just handle it directly.
    // Let's creating a small sub-component for the card could be cleaner, but modifying inline is faster for now.
    // We will just handle the click event directly.

    // Quick helper to show "Added" state could be complex inline without extracting component.
    // We'll proceed with just the functional requirement: Add to cart without redirect.
    const [addedIds, setAddedIds] = useState(new Set());

    const handleAddToCart = (e, product) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop bubbling

        addToCart(product);

        // Optional: Visual feedback
        setAddedIds(prev => {
            const newSet = new Set(prev);
            newSet.add(product.id || product._id || product.sku || product.name);
            return newSet;
        });

        // Reset feedback after 2 seconds
        setTimeout(() => {
            setAddedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id || product._id || product.sku || product.name);
                return newSet;
            });
        }, 2000);
    };

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            // Dynamically calculate scroll amount: card width + gap (24px)
            const card = container.querySelector('.slider-card');
            const cardWidth = card ? card.offsetWidth : 300;
            const gap = 24;
            const scrollAmount = cardWidth + gap;

            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="product-section container">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {categoryLink ? (
                    <Link to={categoryLink} className="see-all">Voir Tout</Link>
                ) : (
                    <span className="see-all disabled">Voir Tout</span>
                )}
            </div>

            <div className="slider-container">
                <button className="nav-btn-floating prev" onClick={() => scroll('left')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="products-slider" ref={scrollContainerRef}>
                    {loading ? (
                        /* Render 5 Skeleton Cards */
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="skeleton-card">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text short"></div>
                                <div className="skeleton-price"></div>
                            </div>
                        ))
                    ) : (
                        products.map((product, index) => {
                            const productId = product.id || product._id || product.sku || product.name;
                            const isAdded = addedIds.has(productId);

                            // Creative logic for badges (can be based on SKU or category)
                            const isNew = index === 0;
                            const isPopular = index === 1 || product.price.includes('DT');

                            const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();

                            return (
                                <Link to={`/product/${product._id || product.id || encodeURIComponent(product.name)}`} key={index} className="product-card slider-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {isPromoActive && <div className="card-badge promo">PROMO !</div>}
                                    {/* {isNew && <div className="card-badge new">NOUVEAU</div>} */}
                                    {/* {isPopular && !isNew && <div className="card-badge popular">POPULAIRE</div>} */}

                                    <div className="product-image-container">
                                        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                                        <div className="quick-action-btns">
                                            <div className="quick-view-circle">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="product-info">
                                        <div className="product-cat-tag">{product.category}</div>
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-price">{product.price}</div>
                                    </div>

                                    <div className="card-actions-overlay">
                                        <button className="action-btn-premium details">
                                            Détails
                                        </button>
                                        <button
                                            className={`action-btn-premium add ${isAdded ? 'added' : ''}`}
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            {isAdded ? "AJOUTÉ" : "AJOUTER"}
                                        </button>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                <button className="nav-btn-floating next" onClick={() => scroll('right')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </section>
    )
}
