import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './GuideInstallation.css';

const GuideInstallation = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings for hero image
                const settingsRes = await fetch('https://Satpromax.com/api/settings');
                const settingsData = await settingsRes.json();
                if (settingsData.success) {
                    setSettings(settingsData.data);
                }

                // Fetch guides
                const guidesRes = await fetch('https://Satpromax.com/api/guides');
                const guidesData = await guidesRes.json();
                if (guidesData.success) {
                    setGuides(guidesData.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredGuides = guides.filter(guide =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const heroImage = settings?.guideHeroImage || "https://www.mysat.tn/wp-content/uploads/2023/11/Popcorn-in-striped-tub-scaled.jpg";
    const pageBgImage = settings?.guidePageBgImage;

    return (
        <div className="guide-page-wrapper" style={pageBgImage ? { backgroundImage: `url(${pageBgImage})`, backgroundAttachment: 'fixed', backgroundSize: 'cover' } : {}}>
            <Header />

            {/* Hero Section */}
            <div className="guide-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImage})` }}>
                <div className="hero-content">
                    <div className="hero-badge">Blog & Article</div>
                    <h1>Blog & Article</h1>
                    <p className="hero-subtitle">Category: Guides d'installation</p>
                </div>
            </div>

            <div className="container">
                {/* Search Bar */}
                <div className="guide-search-container">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Rechercher un guide..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="search-icon-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Chargement des guides...</div>
                ) : (
                    <div className="guides-grid">
                        {filteredGuides.length > 0 ? (
                            filteredGuides.map((guide) => (
                                <div key={guide._id} className="guide-card">
                                    <div className="guide-card-image">
                                        <img src={guide.image || "https://premium.Satpromax.com/wp-content/uploads/2024/09/Logo-sat-PRO-MAX-site-e1726059632832.png"} alt={guide.title} />
                                    </div>
                                    <div className="guide-card-body">
                                        <h2 className="guide-title">{guide.title}</h2>
                                        <div className="guide-meta">
                                            <span className="guide-date">{new Date(guide.createdAt).toLocaleDateString('fr-FR')}</span>
                                            <span className="guide-sep"> . </span>
                                            <span className="guide-comments">No Comments</span>
                                        </div>
                                        <p className="guide-excerpt">
                                            {guide.excerpt || (guide.content.substring(0, 150) + "...")}
                                        </p>
                                        <Link to={`/guide-installation/${guide.slug}`} className="read-more-link">
                                            LIRE LA SUITE <span className="arrow">→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">Aucun guide trouvé pour "{searchQuery}"</div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default GuideInstallation;
