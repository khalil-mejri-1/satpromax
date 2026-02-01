import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SupportPage.css';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://Satpromax.com';

const SupportPage = () => {
    // We'll fetch 'types' (options for the dropdown) and 'fields' (inputs)
    const [config, setConfig] = useState({ types: [], fields: [] });
    // formValues will store: { issueType: '', message: '', [fieldLabel]: '' }
    const [formValues, setFormValues] = useState({ issueType: '', message: '' });

    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Fetch Configuration (Types + Fields) from our new endpoint
        const fetchConfiguration = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/support/config`);
                const data = await res.json();
                if (data.success) {
                    setConfig({
                        types: data.types || [],
                        fields: data.fields || [],
                        heroImage: data.heroImage
                    });

                    // Initialize dynamic fields in state
                    const initialFields = {};
                    if (data.fields) {
                        data.fields.forEach(f => {
                            initialFields[f.label] = '';
                        });
                    }
                    setFormValues(prev => ({ ...prev, ...initialFields }));
                }
            } catch (err) {
                console.error("Error fetching support config:", err);
            }
        };

        fetchConfiguration();
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        // Basic validation for fixed fields
        if (!formValues.issueType) {
            setStatus({ type: 'error', message: 'Veuillez sélectionner la nature du problème.' });
            setSubmitting(false);
            return;
        }

        // Prepare payload
        // We separate fixed fields (issueType, message) from dynamic ones
        const payload = {
            issueType: formValues.issueType,
            message: formValues.message,
            formDetails: config.fields.map(field => ({
                label: field.label,
                value: formValues[field.label] || ''
            }))
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/support/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ type: 'success', message: 'Votre ticket a été envoyé avec succès.' });

                // Reset form
                const resetValues = { issueType: '', message: '' };
                config.fields.forEach(f => resetValues[f.label] = '');
                setFormValues(resetValues);
            } else {
                setStatus({ type: 'error', message: data.message || "Une erreur s'est produite." });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: "Erreur de connexion au serveur." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="support-wrapper">
            <Header />

            <div className="support-hero" style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('${config.heroImage || '/images/support-hero-bg.png'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className="hero-content support_bloc">
                    <h1>Centre de Support</h1>
                    <p>Signalez un problème ou envoyez-nous vos requêtes. Notre équipe est là pour vous aider.</p>
                </div>
            </div>

            <div className="support-container">
                <div className="support-card">
                    <h2>Soumettre un Ticket</h2>

                    <form className="support-form" onSubmit={handleSubmit}>
                        {status && (
                            <div style={{
                                padding: '15px',
                                borderRadius: '12px',
                                background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: status.type === 'success' ? '#166534' : '#991b1b',
                                fontWeight: '600',
                                textAlign: 'center',
                                border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                            }}>
                                {status.message}
                            </div>
                        )}

                        <div className="form-grid">
                            {/* Dynamic Fields Rendering */}
                            {config.fields.map((field, index) => (
                                <div className="form-group" key={index}>
                                    <label>{field.label}</label>
                                    <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        name={field.label}
                                        placeholder={field.placeholder || ''}
                                        value={formValues[field.label] || ''}
                                        onChange={handleChange}
                                        required={true} // Defaulting to true as per request logic, or make configurable
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Fixed Fields */}
                        <div className="form-group">
                            <label>Nature du Problème</label>
                            <select
                                name="issueType"
                                value={formValues.issueType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionnez un type...</option>
                                {config.types.map((type, index) => (
                                    <option key={index} value={type.name}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description du Problème</label>
                            <textarea
                                name="message"
                                placeholder="Décrivez votre problème en détail..."
                                value={formValues.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-support-btn" disabled={submitting}>
                            {submitting ? (
                                <span>Envoi en cours...</span>
                            ) : (
                                <>
                                    <span>Envoyer le Ticket</span>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SupportPage;
