import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import './ApplicationsPage.css';

const ApplicationIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export default function ApplicationsPage() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/applications`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setApps(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="apps-page">
            <Header />
            <main className="container">
                <div className="apps-header">
                    <h1>Nos Applications</h1>
                    <p>Téléchargez nos applications officielles pour une expérience optimale sur tous vos appareils.</p>
                </div>

                <div className="apps-search-container">
                    <svg className="apps-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher une application..."
                        className="apps-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="apps-loading">
                        <div className="spinner"></div>
                        <span>Chargement des applications...</span>
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="no-apps">
                        <div className="no-apps-icon">📱</div>
                        <h3>{searchTerm ? "Aucune application trouvée" : "Bientôt disponible"}</h3>
                        <p>{searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Nos applications arrivent très bientôt. Restez connectés !"}</p>
                    </div>
                ) : (
                    <div className="apps-grid">
                        {filteredApps.map(app => (
                            <div key={app._id} className="app-card">
                                <div className="app-icon-wrapper">
                                    <img src={app.icon} alt={app.name} className="app-icon-img" />
                                    <span className="os-badge">{app.os}</span>
                                </div>
                                <div className="app-content">
                                    <h2 className="app-title">{app.name}</h2>
                                    <p className="app-desc">{app.description || "Simplifiez votre accès avec notre application dédiée."}</p>
                                    <a href={app.downloadLink} target="_blank" rel="noopener noreferrer" className="download-btn">
                                        <DownloadIcon />
                                        {app.name}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="apps-info-section">
                    <div className="info-card">
                        <div className="info-icon">🛡️</div>
                        <h3>Sécurisé</h3>
                        <p>Toutes nos applications sont vérifiées et garanties sans virus ou accès non autorisé.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">⚡</div>
                        <h3>Rapide</h3>
                        <p>Optimisées pour offrir la meilleure fluidité possible même sur les connexions lentes.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🔄</div>
                        <h3>Mise à jour</h3>
                        <p>Des mises à jour régulières pour vous apporter de nouvelles fonctionnalités.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
