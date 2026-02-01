import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './GuideDetailPage.css';
import { API_BASE_URL } from '../config';

const GuideDetailPage = () => {
    const { slug } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings for hero image
                const settingsRes = await fetch(`${API_BASE_URL}/api/settings`);
                const settingsData = await settingsRes.json();
                if (settingsData.success) {
                    setSettings(settingsData.data);
                }

                // Fetch guide
                const guideRes = await fetch(`${API_BASE_URL}/api/guides/slug/${slug}`);
                const guideData = await guideRes.json();
                if (guideData.success) {
                    setGuide(guideData.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div>
            <Header />
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Chargement...</div>
            <Footer />
        </div>
    );

    if (!guide) return (
        <div>
            <Header />
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Article non trouvé</h2>
                <Link to="/guide-installation" className="btn btn-primary" style={{ marginTop: '20px' }}>Retour aux guides</Link>
            </div>
            <Footer />
        </div>
    );

    const heroImage = settings?.guideHeroImage || "https://www.mysat.tn/wp-content/uploads/2023/11/Popcorn-in-striped-tub-scaled.jpg";
    const pageBgImage = settings?.guidePageBgImage;

    return (
        <div className="guide-detail-wrapper" style={pageBgImage ? { backgroundImage: `url(${pageBgImage})`, backgroundAttachment: 'fixed', backgroundSize: 'cover' } : {}}>
            <Header />

            {/* Hero Section */}
            <div className="guide-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImage})` }}>
                <div className="hero-content">
                    <div className="hero-badge">Blog & Article</div>
                    <h1>{guide.title}</h1>
                    <p className="hero-subtitle">Installation & Guide</p>
                </div>
            </div>

            <div className="container guide-content-container">
                <div className="guide-main-image">
                    <img src={guide.image || "https://premium.Satpromax.com/wp-content/uploads/2024/09/Logo-sat-PRO-MAX-site-e1726059632832.png"} alt={guide.title} />
                </div>

                <div className="guide-header-info">
                    <Link to="/guide-installation" className="guide-breadcrumb">Guides d'installation</Link>
                    <h2 className="guide-main-title">{guide.title}</h2>
                    <div className="guide-post-meta">
                        <span>Publié le {new Date(guide.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span className="sep">|</span>
                        <span>Par {guide.author || 'Satpromax'}</span>
                    </div>
                </div>

                <div className="guide-body-content">
                    {guide.content && <div className="guide-intro" dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br/>') }} />}

                    {guide.sections && guide.sections.map((section, idx) => (
                        <div key={idx} className="guide-section">
                            {section.title && <h3 className="section-title">{section.title}</h3>}
                            {section.content && <p className="section-text" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }} />}
                            {section.image && (
                                <div className="section-image">
                                    <img src={section.image} alt={section.title || guide.title} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="guide-footer-actions">
                    <Link to="/guide-installation" className="back-btn">
                        ← Retour aux guides
                    </Link>
                </div>

                {/* Question Section */}
                <div className="article-inquiry-section">
                    <ArticleContactForm articleTitle={guide.title} articleSlug={guide.slug} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

const ArticleContactForm = ({ articleTitle, articleSlug }) => {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        question: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/guide-inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, articleTitle, articleSlug })
            });
            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', message: "Votre question a été envoyée ! Nous vous répondrons bientôt." });
                setFormData({ name: '', whatsapp: '', question: '' });
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Erreur lors de l'envoi." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="inquiry-form-card">
            <div className="inquiry-header">
                <h3>Une question sur cet article ?</h3>
                <p>Posez votre question et nous vous répondrons par WhatsApp.</p>
            </div>
            <form onSubmit={handleSubmit} className="inquiry-form">
                {status && (
                    <div className={`status-msg ${status.type}`}>
                        {status.message}
                    </div>
                )}
                <div className="form-row">
                    <div className="form-group">
                        <label>Votre Nom</label>
                        <input
                            type="text"
                            placeholder="Ex: Ahmed"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Numéro WhatsApp</label>
                        <input
                            type="text"
                            placeholder="+216 ..."
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Votre Question</label>
                    <textarea
                        placeholder="Écrivez votre question ici..."
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="submit-inquiry-btn" disabled={submitting}>
                    {submitting ? "Envoi en cours..." : "Envoyer ma question"}
                </button>
            </form>
        </div>
    );
};

export default GuideDetailPage;
