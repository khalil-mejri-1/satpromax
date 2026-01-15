import React, { useState, useEffect } from 'react';
import './ReviewCarousel.css';

const ReviewCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('https://satpromax.com/api/reviews/approved');
                const data = await response.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const getItemsToDisplay = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const [itemsToDisplay, setItemsToDisplay] = useState(getItemsToDisplay());

    useEffect(() => {
        const handleResize = () => setItemsToDisplay(getItemsToDisplay());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (reviews.length > itemsToDisplay) {
            const timer = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [reviews.length, currentIndex, itemsToDisplay]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, (reviews.length - itemsToDisplay + 1)));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.max(1, (reviews.length - itemsToDisplay + 1))) % Math.max(1, (reviews.length - itemsToDisplay + 1)));
    };

    if (loading) return null;
    if (reviews.length === 0) return null;

    return (
        <section className="reviews-carousel-section container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Ce que disent nos clients</h2>

            <div className="carousel-wrapper">
                <button className="carousel-nav prev" onClick={prevSlide}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="carousel-container">
                    <div
                        className="carousel-track"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsToDisplay)}%)`,
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {reviews.map((review) => (
                            <div className="review-card-item" key={review._id} style={{ flex: `0 0 ${100 / itemsToDisplay}%` }}>
                                <div className="review-card-inner">
                                    <div className="quote-icon">“</div>
                                    <div className="review-rating">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <p className="review-text">{review.comment}</p>
                                    <div className="review-author">
                                        <div className="author-avatar">{review.username.charAt(0).toUpperCase()}</div>
                                        <div className="author-info">
                                            <span className="author-name">{review.username}</span>
                                            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="carousel-nav next" onClick={nextSlide}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </section>
    );
};

export default ReviewCarousel;
