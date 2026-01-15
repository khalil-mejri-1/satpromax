import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ContactUs.css';

const ContactUs = () => {
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch('https://satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSettings(data.data);
                }
            })
            .catch(err => console.error("Error fetching settings:", err));

        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            const res = await fetch('https://satpromax.com/api/contact-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'Merci ! Votre message a été envoyé avec succès.' });
                setFormData({ name: '', whatsapp: '', subject: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message || "Une erreur s'est produite." });
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Erreur de connexion au serveur." });
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappNum = settings?.whatsappNumber || "21697496300";

    return (
        <div className="contact-wrapper">
            <Header />

            <div className="contact-hero">
                <div className="hero-content">
                    <h1>Contactez-nous</h1>
                    <p>Nous sommes là pour répondre à toutes vos questions</p>
                </div>
            </div>

            <div className="contact-container">
                <div className="contact-grid">
                    {/* Info Side */}
                    <div className="contact-info">
                        <div className="contact-info-card">
                            <div className="info-item">
                                <div className="info-icon">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <div className="info-content">
                                    <h3>Téléphone / WhatsApp</h3>
                                    <p>{settings?.footerContactPhone || "+216 97 490 300"}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </div>
                                <div className="info-content">
                                    <h3>Numéro WhatsApp</h3>
                                    <p>+{whatsappNum}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="info-content">
                                    <h3>Heures de travail</h3>
                                    <p>7j/7 - 24h/24 (Support en ligne)</p>
                                </div>
                            </div>

                            <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" className="whatsapp-contact-badge">
                                <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82c1.516.903 3.124 1.379 4.773 1.38h.005c5.441 0 9.869-4.427 9.871-9.87.001-2.636-1.026-5.115-2.892-6.983-1.866-1.868-4.346-2.895-6.983-2.896-5.442 0-9.87 4.427-9.873 9.871-.001 1.739.456 3.437 1.321 4.925l-.83 3.033 3.108-.815zm11.411-7.55c-.171-.086-1.014-.5-1.171-.557-.157-.057-.271-.086-.385.086-.114.172-.442.557-.542.671-.1.114-.2.128-.371.043-.171-.086-.723-.266-1.377-.849-.51-.454-.853-1.014-.953-1.186-.1-.171-.011-.264.075-.349.076-.076.171-.2.257-.3.085-.1.114-.171.171-.3.057-.128.028-.243-.014-.328-.043-.086-.385-.929-.528-1.272-.14-.335-.282-.289-.385-.294-.1-.005-.214-.006-.328-.006-.114 0-.3.043-.457.214-.157.172-.6.586-.6 1.429 0 .843.614 1.657.7 1.771.086.115 1.209 1.846 2.928 2.587.409.176.728.281.977.36.41.13.784.112 1.078.068.329-.049 1.014-.414 1.157-.814.143-.4.143-.743.1-.814-.043-.071-.157-.114-.328-.2z" /></svg>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '15px' }}>Besoin d'aide immédiate?</div>
                                    <div style={{ fontSize: '13px' }}>Discutez avec nous sur WhatsApp</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="contact-form-side">
                        <div className="contact-form-card">
                            <h2>Envoyez-nous un message</h2>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                {status && (
                                    <div style={{
                                        padding: '15px',
                                        borderRadius: '12px',
                                        background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                                        color: status.type === 'success' ? '#166534' : '#991b1b',
                                        marginBottom: '20px',
                                        fontWeight: '600'
                                    }}>
                                        {status.message}
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom complet</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Ahmed Ben Salah"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>WhatsApp</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: +216..."
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label>Sujet</label>
                                    <input
                                        type="text"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '30px' }}>
                                    <label>Message</label>
                                    <textarea
                                        placeholder="Détaillez votre demande ici..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-contact-btn" disabled={submitting}>
                                    {submitting ? "Envoi en cours..." : "Envoyer le message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;
