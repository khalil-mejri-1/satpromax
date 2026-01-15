import React, { useState, useEffect } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [settings, setSettings] = useState(null);
    const [mainIndex, setMainIndex] = useState(0);
    const [boxIndex, setBoxIndex] = useState(0);

    // Fetch settings
    useEffect(() => {
        fetch('http://localhost:3000/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setSettings(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Slider Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setMainIndex(prev => prev + 1);
            setBoxIndex(prev => prev + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Helper to get image array safely
    const getHeroImages = (images, defaultImg) => {
        if (!images || images.length === 0) return [defaultImg];
        return images;
    };

    const defaultMain = "https://www.mysat.tn/wp-content/uploads/2025/10/design-sans-titre12.webp";
    const defaultBox = "https://www.mysat.tn/wp-content/uploads/2025/05/design-sans-titre-29.webp";
    const defaultNetflix = "https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg";
    const defaultGift = "https://www.mysat.tn/wp-content/uploads/2025/05/design-sans-titre-21.webp";
    const defaultSoft = "https://www.mysat.tn/wp-content/uploads/2025/10/the-phases-of-a-software-development-life-cycle-scaled-1-scaled.webp";

    const mainImages = settings ? getHeroImages(settings.heroMainImages, defaultMain) : [defaultMain];
    const boxImages = settings ? getHeroImages(settings.heroCardBoxImages, defaultBox) : [defaultBox];

    const netflixBg = (settings && settings.heroCardNetflixImage) ? settings.heroCardNetflixImage : defaultNetflix;
    const giftBg = (settings && settings.heroCardGiftImage) ? settings.heroCardGiftImage : defaultGift;
    const softBg = (settings && settings.heroCardSoftImage) ? settings.heroCardSoftImage : defaultSoft;

    return (
        <section className="hero container">
            <div className="hero-grid">
                {/* Main Large Banner */}
                <div className="hero-main">
                    {/* Background Slider */}
                    <div className="hero-slider-bg">
                        {mainImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`slider-slide ${idx === (mainIndex % mainImages.length) ? 'active' : ''}`}
                                style={{
                                    backgroundImage: `linear-gradient(135deg, rgba(16, 16, 16, 0.95) 0%, rgba(32, 32, 32, 0.5) 100%), url(${img})`
                                }}
                            />
                        ))}
                    </div>

                    <div className="hero-content">
                        <h2 className="hero-title">Abonnement<br />IPTV</h2>
                        <p className="hero-subtitle">IPTV Premium : Ultra-HD, Stable, Rapide, Illimité.</p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <Link to="/category/iptv-sharing" className="btn btn-outline-white">DÉCOUVREZ MAINTENANT</Link>
                            <Link to="/category/promotions" className="btn-promo-creative">
                                <span className="promo-icon">🔥</span>
                                <span className="promo-text">OFFRES SPÉCIALES</span>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    {mainImages.length > 1 && (
                        <div className="hero-dots">
                            {mainImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`dot ${idx === (mainIndex % mainImages.length) ? 'active' : ''}`}
                                    onClick={() => setMainIndex(idx)}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Grid */}
                <div className="hero-side-grid">
                    <Link to="/category/box-android" className="hero-card card-box" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {/* Background Slider Box */}
                        <div className="hero-slider-bg">
                            {boxImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`slider-slide ${idx === (boxIndex % boxImages.length) ? 'active' : ''}`}
                                    style={{
                                        backgroundImage: `linear-gradient(180deg, rgba(8, 47, 73, 0.9) 0%, rgba(15, 23, 42, 0.1) 60%), url(${img})`
                                    }}
                                />
                            ))}
                        </div>
                        <h3>Box Android<br />Et Recepteur</h3>
                    </Link>
                    <Link
                        to="/category/streaming"
                        className="hero-card card-netflix"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%), url(${netflixBg})`,
                            textDecoration: 'none', color: 'inherit'
                        }}
                    >
                        <h3>Netflix<br />Tunisie</h3>
                    </Link>
                    <Link
                        to="/category/gift-card"
                        className="hero-card card-gift"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(88, 28, 135, 0.9) 0%, rgba(59, 7, 100, 0.1) 60%), url(${giftBg})`,
                            textDecoration: 'none', color: 'inherit'
                        }}
                    >
                        <h3>Cartes Cadeaux<br />Digitales</h3>
                    </Link>
                    <Link
                        to="/category/software"
                        className="hero-card card-soft"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(3, 105, 161, 0.9) 0%, rgba(8, 47, 73, 0.1) 60%), url(${softBg})`,
                            textDecoration: 'none', color: 'inherit'
                        }}
                    >
                        <h3>Logiciels</h3>
                    </Link>
                </div>
            </div>
        </section>
    )
}
