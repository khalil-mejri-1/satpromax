import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import './Footer.css';

export default function Footer() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetch('https://Satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setSettings(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Reload Trustpilot widgets on mount
    useEffect(() => {
        if (window.Trustpilot) {
            window.Trustpilot.loadFromElement(document.querySelector('.footer .trustpilot-widget'));
        }
    }, []);

    const footerDesc = (settings && settings.footerDescription) ? settings.footerDescription : "Satpromax est en train de devenir un leader mondial dans le domaine du divertissement numérique. Forts de nombreuses années d'expérience, nous offrons des solutions innovantes et fiables pour vous garantir une expérience fluide et sans interruption.";
    const footerPhone = (settings && settings.footerContactPhone) ? settings.footerContactPhone : "TN +216 97 490 300";
    const whatsappNumber = (settings && settings.whatsappNumber) ? settings.whatsappNumber.replace(/\D/g, '') : "21697496300";

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    };

    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-col about-col">
                    <h3>À Propos De Nous</h3>
                    <p>{footerDesc}</p>
                </div>

                {/* Dynamic Footer Columns */}
                {[
                    settings?.footerColumn1 || { title: 'IPTV Premium', links: ['Esiptv-Pro Plus', 'Orca Pro Max', 'ALPHA IPTV', 'FOSTO', 'Sstv+'] },
                    settings?.footerColumn2 || { title: 'Streaming', links: ['Netflix', 'Amazon Prime', 'Crunchyroll'] },
                    settings?.footerColumn3 || { title: 'Cartes Cadeaux', links: ['Voucher Rewarble', 'Carte iTunes'] }
                ].map((col, idx) => (
                    <div className="footer-col" key={idx}>
                        <h3>
                            <Link to={`/${slugify(col.title)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {col.title}
                            </Link>
                        </h3>
                        <ul>
                            {col.links && col.links.map((link, i) => (
                                <li key={i}>
                                    <Link to={`/${slugify(col.title)}/${slugify(link)}`}>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="footer-col contact-col">
                    <span>Vous avez une question ?</span>
                    <div className="phone-number">{footerPhone}</div>

                    <div className="social-icons">
                        <a href={settings?.facebookUrl || "https://www.facebook.com"} target="_blank" rel="noopener noreferrer" className="social-icon facebook" title="Facebook">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="none">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href={settings?.telegramUrl || "https://t.me/"} target="_blank" rel="noopener noreferrer" className="social-icon telegram" title="Telegram">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="none">
                                <path d="M21.816 2.466c.219-.574-.216-1.124-.816-.925L2.5 9.172c-.6.2-1.15.748-.95 1.348.2 1.35 1.5 2 2.5 2.5l3.5 1.5 1.5 4a1.002 1.002 0 0 0 1.642.616l2.358-2.358 4 3c.5.3 1 .1 1.2-.4l4-15a1 1 0 0 0 .016-1.812z" />
                            </svg>
                        </a>
                        {settings?.socialLinks && settings.socialLinks.map((link, i) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon" title={link.name}>
                                {link.icon && link.icon.startsWith('http') ? (
                                    <img src={link.icon} alt={link.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                ) : (
                                    <span>●</span> // Fallback
                                )}
                            </a>
                        ))}
                    </div>

                    <div className="footer-contact-actions">
                        <Link to="/contact" className="btn btn-yellow contact-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', width: '100%', margin: '15px 0 0' }}>
                            Contactez-nous à tout moment !
                        </Link>

                        {/* Trustpilot Widget Wrapper to match button width */}
                        <div className="footer-trustpilot-wrapper">
                            <div
                                className="trustpilot-widget"
                                data-locale="en-US"
                                data-template-id="56278e9abfbbba0bdcd568bc"
                                data-businessunit-id="69693f33a1c7054e87aa85b8"
                                data-style-height="52px"
                                data-style-width="100%"
                                data-token="2a0b3e50-b416-4a8e-be20-5d3da4454f2d"
                            >
                                <a href="https://www.trustpilot.com/review/Satpromax.com" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Copyright © <strong>Satpromax</strong>. Tous droits réservés.</p>
            </div>

            <div className="floating-buttons">
                {/* <button className="float-btn scroll-top">↑</button> */}
                <button className="float-btn whatsapp" onClick={handleWhatsAppClick}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </button>
            </div>
        </footer>
    )
}

