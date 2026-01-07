import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="hero container">
            <div className="hero-grid">
                {/* Main Large Banner */}
                <div className="hero-main">
                    <div className="hero-content">
                        <h2 className="hero-title">Abonnement<br />IPTV</h2>
                        <p className="hero-subtitle">IPTV Premium : Ultra-HD, Stable, Rapide, Illimité.</p>
                        <Link to="/category/iptv-sharing" className="btn btn-outline-white">DÉCOUVREZ MAINTENANT</Link>
                    </div>
                    <div className="hero-image-placeholder main-remote">
                        {/* Imagine a remote control here */}
                    </div>
                </div>

                {/* Side Grid */}
                <div className="hero-side-grid">
                    <div className="hero-card card-box">
                        <h3>Box Android<br />Et Recepteur</h3>
                        <div className="card-img-holder box-img" />
                    </div>
                    <div className="hero-card card-netflix">
                        <h3>Netflix<br />Tunisie</h3>
                        <div className="card-img-holder netflix-img" />
                    </div>
                    <div className="hero-card card-gift">
                        <h3>Cartes Cadeaux<br />Digitales</h3>
                        <div className="card-img-holder gift-img" />
                    </div>
                    <div className="hero-card card-soft">
                        <h3>Logiciels</h3>
                        <div className="card-img-holder soft-img" />
                    </div>
                </div>
            </div>
        </section>
    )
}
