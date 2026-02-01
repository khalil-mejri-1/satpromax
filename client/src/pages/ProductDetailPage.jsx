import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import './ProductDetailPage.css';
import { countryCodes } from '../data/countryCodes';
import SEO from '../components/SEO/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://Satpromax.com';

// Extended Mock Data (In a real app, this would come from an API)
const allProducts = [
    // Streaming
    { name: 'Netflix Tunisie Premium', price: '12 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/10/netflix-tunisie-premium-small.webp', category: 'Streaming', description: 'Profitez de Netflix Premium en 4K UHD sur 4 écrans simultanés.', sku: 'STR-001', tags: 'netflix, streaming, 4k' },
    { name: 'Shahid VIP', price: '20 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/shahid-vip-small.webp', category: 'Streaming', description: 'Shahid VIP. استمتع بمشاهده أحدث المسلسلات والأفلام العربية والعالمية بدون إعلانات.', sku: 'STR-005', tags: 'shahid, vip, arabic' },
    { name: 'Netflix Tunisie Premium 1 User', price: '15 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/01/netflix-tunisie-premium-1-user-small.webp', category: 'Streaming', description: 'Netflix Premium en partage pour 1 utilisateur.', sku: 'STR-007', tags: 'netflix, streaming' },
    { name: 'Netflix Tunisie Standard', price: '10 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/11/netflix-tunisie-standard-1-small.webp', category: 'Streaming', description: 'Netflix Standard HD sur 2 écrans.', sku: 'STR-006', tags: 'netflix, streaming' },
    { name: 'Service de Streaming', price: '20 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/03/Votre-texte-de-paragraphe-small.png', category: 'Streaming', description: 'Service de streaming complet.', sku: 'STR-008', tags: 'streaming' },
    { name: 'YouTube Premium', price: '18 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/youtube-premium-small.webp', category: 'Streaming', description: 'YouTube sans pub et en arrière-plan.', sku: 'STR-009', tags: 'youtube' },
    { name: 'Crunchyroll Mega Fan', price: '18 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/crunchyroll-mega-fan-premium-small.webp', category: 'Streaming', description: 'Le meilleur de l\'anime en HD, sans publicité.', sku: 'STR-003', tags: 'anime, crunchyroll' },
    { name: 'Amazon Prime Video', price: '15 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/amazon-prime-video-300x300.webp', category: 'Streaming', description: 'Accès illimité aux films et séries Amazon Originals.', sku: 'STR-002', tags: 'prime video, amazon' },

    // IPTV
    { name: 'Abonnement ORCA PRO MAX', price: '55 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/abonnement-orca-pro-max-tunisie-300x300.webp', category: 'IPTV Premium', description: 'Serveur IPTV stable avec plus de 10000 chaines et VOD.', sku: 'IPTV-001', tags: 'iptv, orca' },
    { name: 'Abonnement Esiptv Pro Plus', price: '65 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/esiptv-pro-plus-300x300.webp', category: 'IPTV Premium', description: 'La meilleure qualité d\'image pour vos chaînes préférées.', sku: 'IPTV-002', tags: 'iptv, esiptv' },
    { name: 'Abonnement ORCA PRO MAX + Diwan Sport', price: '74 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/abonnement-orca-pro-max-diwan-sport-300x300.webp', category: 'IPTV Premium', description: 'Pack spécial sport et divertissement.', sku: 'IPTV-003', tags: 'iptv, orca, sport' },
    { name: 'Abonnement ALPHA IPTV + DIWAN SPORT', price: '104 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/alpha-iptv-diwan-sport-taalimiya-300x300.webp', category: 'IPTV Premium', description: 'Alpha IPTV, la référence en Tunisie.', sku: 'IPTV-004', tags: 'iptv, alpha' },
    { name: 'Esiptv Pro Plus + Diwan Sport', price: '74 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/02/product-box-mockup-300x300.jpg', category: 'IPTV Premium', description: 'Offre combinée Esiptv et Diwan Sport.', sku: 'IPTV-005', tags: 'esiptv, diwan' },
    { name: 'Abonnement KING 365', price: '109 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/03/king-365-300x300.webp', category: 'IPTV Premium', description: 'Abonnement King 365 premium.', sku: 'IPTV-006', tags: 'king365' },

    // Music
    { name: 'Spotify Premium Individual', price: '25 DT', image: 'https://placehold.co/300x300/1DB954/FFF?text=Spotify', category: 'Music', description: 'Musique sans pub, écoute hors ligne et qualité sonore supérieure.', sku: 'MUS-001', tags: 'music, spotify' },
    { name: 'Deezer Premium', price: '25 DT', image: 'https://placehold.co/300x300/000/FFF?text=Deezer', category: 'Music', description: 'Deezer Premium, toute votre musique en illimité.', sku: 'MUS-002', tags: 'music, deezer' },
    { name: 'Anghami Plus', price: '20 DT', image: 'https://placehold.co/300x300/A020F0/FFF?text=Anghami', category: 'Music', description: 'Anghami Plus, la musique arabe et internationale.', sku: 'MUS-003', tags: 'music, anghami' },

    // Box
    { name: 'Box Android', price: '155 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/04/Votre-texte-de-paragraphe-7-small.png', category: 'Box Android', description: 'Transformez votre TV en Smart TV Android.', sku: 'BOX-001', tags: 'box, android' },
    { name: 'Box TV Android', price: '105 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/04/Votre-texte-de-paragraphe-8-small.png', category: 'Box Android', description: 'Boîtier Android performant et économique.', sku: 'BOX-002', tags: 'box, android' },
    { name: 'Box Android TV', price: '149 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/04/Votre-texte-de-paragraphe-12-small.png', category: 'Box Android', description: 'Expérience Android TV fluide.', sku: 'BOX-003', tags: 'box, android' },
    { name: 'Box Android SamBox', price: '149 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/04/Votre-texte-de-paragraphe-14-small.png', category: 'Box Android', description: 'SamBox pour un divertissement illimité.', sku: 'BOX-004', tags: 'box, sambox' },
    { name: 'RÉCEPTEUR STARSAT', price: '90 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/05/Votre-texte-de-paragraphe-1-small.png', category: 'Box Android', description: 'Récepteur satellite Starsat HD.', sku: 'BOX-005', tags: 'recepteur, starsat' },
    { name: 'Box TV', price: '120 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/05/design-sans-titre-43-small.webp', category: 'Box Android', description: 'Box TV polyvalente.', sku: 'BOX-006', tags: 'box, tv' },
    { name: 'Android Box', price: '130 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/05/Votre-texte-de-paragraphe-4-small.png', category: 'Box Android', description: 'Android Box 4K.', sku: 'BOX-007', tags: 'box, android' },
    { name: 'Smart Box', price: '140 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/05/design-sans-titre-41-small.webp', category: 'Box Android', description: 'Smart Box pour streaming et jeux.', sku: 'BOX-008', tags: 'box, smart' },

    // Gift Cards
    { name: 'Apple Carte Cadeau iTunes USA', price: '49 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/apple-carte-cadeau-itunes-app-store-usa-small.webp', category: 'Gift Card', description: 'Crédit pour App Store, Apple Music et plus (USA).', sku: 'GC-001', tags: 'apple, itunes' },
    { name: 'Voucher Rewarble Pay', price: '55 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/rewarble-small.webp', category: 'Gift Card', description: 'Payez en ligne en toute sécurité.', sku: 'GC-002', tags: 'voucher, rewarble' },
    { name: 'Apple Carte Cadeau iTunes FR', price: '55 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/apple-carte-cadeau-itunes-app-store-fr-small.webp', category: 'Gift Card', description: 'Carte iTunes Store France.', sku: 'GC-003', tags: 'apple, itunes' },
    { name: 'Carte Cadeau Steam FR', price: '50 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/steam-fr-gift-card-small.webp', category: 'Gift Card', description: 'Carte cadeau Steam France.', sku: 'GC-004', tags: 'steam, gift' },
    { name: 'Carte Cadeau Générique', price: '20 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/votre-texte-de-paragraphe-2-small.webp', category: 'Gift Card', description: 'Carte cadeau générique.', sku: 'GC-005', tags: 'gift' },
    { name: 'Autre Carte Cadeau', price: '30 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/votre-texte-de-paragraphe-11-small.webp', category: 'Gift Card', description: 'Une autre carte cadeau.', sku: 'GC-006', tags: 'gift' },
    { name: 'Carte Cadeau Spéciale', price: '40 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/votre-texte-de-paragraphe-1-small.webp', category: 'Gift Card', description: 'Carte cadeau spéciale.', sku: 'GC-007', tags: 'gift' },

    // Gaming
    { name: 'Free Fire Diamond', price: '20 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/free-fire-diamond-small.webp', category: 'Gaming', description: 'Diamants pour Free Fire.', sku: 'GC-008', tags: 'freefire, game' },
    { name: 'Carte Cadeau Playstation', price: '50 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/apple-carte-cadeau-itunes-app-store-usa-small.webp', category: 'Gaming', description: 'Carte PSN pour Playstation Store.', sku: 'GC-009', tags: 'psn, sony' },

    // Software & Others
    { name: 'Abonnement ChatGPT Plus', price: '99 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/chatgpt-plus-tunisie-300x300.webp', category: 'Software', description: 'Accédez à GPT-4 et aux fonctionnalités avancées.', sku: 'SOFT-001', tags: 'ai, chatgpt' },
    { name: 'Abonnement LinkedIn Premium', price: '199 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/linkedin-premium-career-300x300.webp', category: 'Software', description: 'Boostez votre carrière avec LinkedIn Premium.', sku: 'SOFT-002', tags: 'linkedin, career' },
    { name: 'CapCut Pro', price: '99 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/04/capcut-pro-300x300.webp', category: 'Software', description: 'Éditeur vidéo puissant avec fonctionnalités Pro.', sku: 'SOFT-003', tags: 'video, editing' },
    { name: 'Coursera Plus', price: '169 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/coursera-plus-300x300.webp', category: 'Software', description: 'Apprentissage illimité sur Coursera.', sku: 'SOFT-004', tags: 'learning, course' },
    { name: 'Google Gemini AI', price: '50 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/11/abonnement-google-gemini-ai-300x300.webp', category: 'Software', description: 'L\'IA multimodale de Google.', sku: 'SOFT-005', tags: 'ai, google' },
    { name: 'Cursor AI Pro', price: '99 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/10/cursor-ai-pro-300x300.webp', category: 'Software', description: 'L\'éditeur de code IA le plus puissant.', sku: 'SOFT-006', tags: 'ai, code, cursor' },
    { name: 'Claude AI Pro', price: '80 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/10/claude-ai-pro-300x300.webp', category: 'Software', description: 'IA conversationnelle avancée par Anthropic.', sku: 'SOFT-007', tags: 'ai, claude' },
    { name: 'Adobe Creative Cloud', price: '169 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/12/adobe-creative-cloud-300x300.webp', category: 'Software', description: 'Suite complète Adobe pour créatifs.', sku: 'SOFT-008', tags: 'design, adobe' },
    { name: 'Microsoft 365 Personnel', price: '120 DT', image: 'https://www.mysat.tn/wp-content/uploads/2024/11/microsoft-365-personnel-small.webp', category: 'Software', description: 'Office apps et stockage cloud.', sku: 'SOFT-009', tags: 'office, microsoft' },
    { name: 'Design AI', price: '90 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/11/design-sans-titre-3-300x300.webp', category: 'Software', description: 'Outils de design assistés par IA.', sku: 'SOFT-010', tags: 'design, ai' },
    { name: 'Perplexity Pro', price: '100 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/10/perplexity-pro-300x300.webp', category: 'Software', description: 'Moteur de recherche conversationnel IA.', sku: 'SOFT-011', tags: 'search, ai' },
    { name: 'ChatGPT Pro', price: '110 DT', image: 'https://www.mysat.tn/wp-content/uploads/2025/01/chatgpt-pro-300x300.webp', category: 'Software', description: 'Version professionnelle de ChatGPT.', sku: 'SOFT-012', tags: 'ai, chatgpt' },
];

const SimilarProductCard = ({ item, addToCart, setModal }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdded(true);
        addToCart(item);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div
            className="premium-similar-card"
            style={{
                position: 'relative',
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                minWidth: '260px',
                maxWidth: '260px',
                margin: '15px 10px',
                height: '420px'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#f1f5f9';
            }}
        >
            {item.promoPrice && new Date(item.promoEndDate) > new Date() && (
                <div className="card-badge-similar promo">
                    <img src="https://i.ibb.co/4x2XwJy/pngtree-special-promo-banner-shape-vector-png-image-7113277.png" alt="Promo" />
                </div>
            )}
            <Link to={`/${slugify(item.category)}/${item.slug || slugify(item.name)}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    height: '220px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '12px',
                    borderRadius: '18px',
                    position: 'relative'
                }}>
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{
                            maxWidth: '85%',
                            maxHeight: '85%',
                            objectFit: 'contain',
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="similar-card-img"
                    />
                </div>
                <div style={{ padding: '10px 20px' }}>
                    <h6 style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', margin: 0 }}>{item.category}</h6>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        marginBottom: '10px',
                        color: '#0f172a',
                        lineHeight: '1.4',
                        height: '42px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>{item.name}</h3>
                    <h4 style={{ fontSize: '20px', fontWeight: '900', color: '#D32F2F', margin: 0 }}>{item.price}</h4>
                </div>
            </Link>

            <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: '8px' }}>
                <Link
                    to={`/${slugify(item.category)}/${item.slug || slugify(item.name)}`}
                    style={{
                        flex: 1,
                        background: '#f1f5f9',
                        color: '#1e293b',
                        textDecoration: 'none',
                        textAlign: 'center',
                        padding: '12px 5px',
                        borderRadius: '14px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
                >
                    détails
                </Link>
                <button
                    onClick={handleAddToCart}
                    style={{
                        flex: 1,
                        background: isAdded ? '#22c55e' : '#fbbf24',
                        color: isAdded ? '#fff' : '#000',
                        border: 'none',
                        padding: '12px 5px',
                        borderRadius: '14px',
                        fontSize: '11px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isAdded ? '0 8px 20px rgba(34, 197, 94, 0.3)' : '0 4px 10px rgba(251, 191, 36, 0.2)'
                    }}
                >
                    {isAdded ? "AJOUTÉ" : "AJOUTER"}
                </button>
            </div>
        </div>
    );
};

export default function ProductDetailPage() {
    const { category, slug } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const { addToCart, addToWishlist } = useContext(ShopContext);
    const carouselRef = React.useRef(null);
    const reviewsSectionRef = React.useRef(null);
    const [reviews, setReviews] = useState([]);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentModes, setPaymentModes] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [deviceChoices, setDeviceChoices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [receiverSerial, setReceiverSerial] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState("21697496300");
    const [activeImage, setActiveImage] = useState(null);
    const [settings, setSettings] = useState(null);

    // Share & Compare & UI states
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [compareProduct, setCompareProduct] = useState(null);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const [selectedCountryCode, setSelectedCountryCode] = useState('+216');
    const [localWhatsapp, setLocalWhatsapp] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const [billingInfo, setBillingInfo] = useState({
        name: user ? user.username : '',
        address: '',
        whatsapp: '',
        paymentMode: ''
    });

    const [modal, setModal] = useState({ show: false, message: '', type: 'success' });
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        username: user ? user.username : '',
        comment: '',
        rating: 5
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Update name if user logs in while on page
    useEffect(() => {
        if (user && !billingInfo.name) {
            setBillingInfo(prev => ({ ...prev, name: user.username }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
    };

    // Share handlers
    // Share handlers
    // Use public API domain for sharing so Facebook hits the Node server (not React frontend)
    const shareUrl = product ? `https://api.Satpromax.com/share/produit/${encodeURIComponent(product.category)}/${product.slug}` : "";

    const shareOnFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=500,scrollbars=yes,resizable=yes'
        );
    };

    const shareOnTelegram = () => {
        const text = `Découvrez ${product.name} sur Satpromax !`;
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            '_blank'
        );
    };


    // Compare handlers
    const handleCompare = () => {
        const storedProduct = localStorage.getItem('compare_product');
        if (!storedProduct) {
            localStorage.setItem('compare_product', JSON.stringify(productWithId));
            setModal({
                show: true,
                title: "Premier produit enregistré",
                message: "Le premier produit a été enregistré. Choisissez un deuxième produit pour comparer.",
                type: 'success',
                btnText: "Continuer"
            });
        } else {
            const firstProduct = JSON.parse(storedProduct);
            if (firstProduct.id === productWithId.id) {
                setModal({ show: true, message: "Vous avez déjà sélectionné ce produit. Choisissez-en un autre.", type: 'error' });
                return;
            }
            setCompareProduct(firstProduct);
            setCompareModalOpen(true);
        }
    };

    // Scroll handler for Similar Products carousel
    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Fetch Similar Products
    useEffect(() => {
        if (product && product.category) {
            fetch(`https://Satpromax.com/api/products?category=${encodeURIComponent(product.category)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const filtered = data.data.filter(p => (p._id || p.id) !== productWithId.id);
                        setSimilarProducts(filtered);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [product]);

    // Auto-slide similar products every 2 seconds
    useEffect(() => {
        if (similarProducts.length > 0) {
            const interval = setInterval(() => {
                if (carouselRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    // Check if we are at the end
                    if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
                        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scroll by one card width + gap (approx 260 + 15 = 275)
                        carouselRef.current.scrollBy({ left: 275, behavior: 'smooth' });
                    }
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [similarProducts]);

    // Fetch Settings
    useEffect(() => {
        fetch('https://Satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setSettings(data.data);
                    setPaymentModes(data.data.paymentModes || []);
                    setDeviceChoices(data.data.deviceChoices || ['1 Mois', '3 Mois', '12 Mois']);
                    if (data.data.paymentModes && data.data.paymentModes.length > 0) {
                        setBillingInfo(prev => ({ ...prev, paymentMode: data.data.paymentModes[0].name }));
                    }
                    if (data.data.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber);
                }
            })
            .catch(err => console.error(err));
    }, []);

    // SEO Meta Tags managed by <SEO /> component below

    // Reload Trustpilot widgets when product changes
    useEffect(() => {
        if (product && window.Trustpilot) {
            const widget = document.querySelector('.product-info-section .trustpilot-widget');
            if (widget) window.Trustpilot.loadFromElement(widget);
        }
    }, [product]);


    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                let response;
                let data = { success: false };

                try {
                    // Try fetch by slug first
                    response = await fetch(`https://Satpromax.com/api/products/slug/${category}/${slug}`);
                    data = await response.json();
                } catch (e) {
                    console.log("DB Fetch failed");
                }

                if (data.success) {
                    setProduct(data.data);
                    setActiveImage(data.data.image);
                    setLoading(false);
                    return;
                }

                // Temporary backward compatibility check for old IDs or direct names
                if (slug.match(/^[0-9a-fA-F]{24}$/)) {
                    response = await fetch(`https://Satpromax.com/api/products/${slug}`);
                    data = await response.json();
                    if (data.success) {
                        setProduct(data.data);
                        setActiveImage(data.data.image);
                        setLoading(false);
                        return;
                    }
                }

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [category, slug]);

    // Ensure product object structure is consistent
    const productWithId = product ? { ...product, id: product._id || product.id || product.sku } : null;

    // Fetch reviews for this product
    useEffect(() => {
        if (productWithId && productWithId.id) {
            fetch(`${API_BASE_URL}/api/reviews/product/${productWithId.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setReviews(data.data);
                    }
                })
                .catch(err => console.error("Error fetching reviews:", err));
        }
    }, [productWithId?.id]);

    const scrollToReviews = () => {
        if (reviewsSectionRef.current) {
            reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const renderStars = (rating, size = '16px') => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} style={{ color: '#fbbf24', fontSize: size }}>★</span>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<span key={i} style={{ color: '#fbbf24', fontSize: size, position: 'relative' }}>
                    <span style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>★</span>
                    <span style={{ color: '#e2e8f0' }}>★</span>
                </span>);
            } else {
                stars.push(<span key={i} style={{ color: '#e2e8f0', fontSize: size }}>★</span>);
            }
        }
        return stars;
    };

    if (loading) {
        return <div className="page-wrapper"><Header /><main className="main-content" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</main><Footer /></div>;
    }

    if (!product) {
        return <div className="page-wrapper"><Header /><main className="main-content" style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Produit introuvable</main><Footer /></div>;
    }

    const handleConfirmOrder = async () => {
        // Validation for the Name field
        const customerName = (billingInfo.name || "").trim();

        if (!customerName) {
            setModal({ show: true, message: "Veuillez entrer votre nom.", type: 'error' });
            return;
        }

        if (customerName.length < 2) {
            setModal({ show: true, message: "Le nom est trop court (minimum 2 caractères).", type: 'error' });
            return;
        }

        if (customerName.length > 20) {
            setModal({ show: true, message: "Le nom est trop long (maximum 20 caractères).", type: 'error' });
            return;
        }

        if (/\d/.test(customerName)) {
            setModal({ show: true, message: "Le nom ne doit pas contenir de chiffres.", type: 'error' });
            return;
        }

        if (isIPTVCategory && !selectedDevice) {
            setModal({ show: true, message: "Veuillez choisir votre appareil avant de commander.", type: 'error' });
            return;
        }

        if (isSharingCategory && !receiverSerial) {
            setModal({ show: true, message: "Veuillez entrer le numéro de série de votre récepteur.", type: 'error' });
            return;
        }

        if (!billingInfo.whatsapp || !localWhatsapp || localWhatsapp.trim().length === 0) {
            setModal({ show: true, message: "Veuillez entrer votre numéro WhatsApp.", type: 'error' });
            return;
        }

        // Calculate total
        const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();
        const displayPrice = isPromoActive ? product.promoPrice : product.price;
        const rawPrice = displayPrice ? String(displayPrice) : '0';
        const productPrice = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 0;


        let shippingCost = 0;
        if (product.hasDelivery && product.deliveryPrice) {
            shippingCost = parseInt(String(product.deliveryPrice).replace(/[^0-9]/g, '')) || 0;
        } else if (!product.hasOwnProperty('hasDelivery')) {
            // Fallback for old products or logic if needed, but per request if not selected, don't add it.
            // However, previously it was fixed +7. Let's assume if hasDelivery is undefined for old items, maybe keep 7 or 0? 
            // The user said "if I don't select ... do not add it". So default should be 0.
            shippingCost = 0;
        }

        const totalAmount = (productPrice * quantity) + shippingCost;

        const orderData = {
            userId: user ? (user._id || user.id) : null,
            isGuest: !user,
            userValidation: {
                name: customerName,
                address: billingInfo.address,
                whatsapp: billingInfo.whatsapp
            },
            items: [{
                productId: productWithId.id,
                name: product.name,
                quantity: quantity,
                price: displayPrice,
                image: product.image,
                deviceChoice: isIPTVCategory ? selectedDevice : null,
                receiverSerial: isSharingCategory ? receiverSerial : null
            }],
            totalAmount: totalAmount,
            paymentMethod: billingInfo.paymentMode || 'cod'
        };

        try {
            const response = await fetch('https://Satpromax.com/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                // Construct WhatsApp message
                const productUrl = window.location.href;
                const messageText =
                    `*Nouvelle Commande Express*\n\n` +
                    `Produit: ${product.name}\n` +
                    `Lien: ${productUrl}\n` +
                    `Prix: ${displayPrice}\n` +
                    `Quantité: ${quantity}\n\n` +
                    `---------------------------\n\n` +
                    `Informations Client:\n` +
                    `Nom: ${billingInfo.name}\n` +
                    `Téléphone: ${billingInfo.whatsapp}\n` +
                    `Paiement: ${billingInfo.paymentMode || "COD"}\n` +
                    (isIPTVCategory ? `Appareil: ${selectedDevice || "N/A"}\n` : "") +
                    (isSharingCategory ? `S/N Récepteur: ${receiverSerial || "N/A"}\n` : "") +
                    `\n` +
                    `---------------------------\n\n` +
                    `Merci de confirmer cette commande.`;

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`;

                // Redirect to WhatsApp immediately
                window.open(whatsappUrl, '_blank');

                setModal({
                    show: true,
                    message: "Votre commande a été enregistrée et vous avez été redirigé vers WhatsApp pour la confirmation finale.",
                    type: 'success',
                    onClose: () => navigate(user ? '/profile' : '/')
                });
            } else {
                setModal({ show: true, message: "Erreur: " + data.message, type: 'error' });
            }
        } catch (error) {
            console.error("Order error:", error);
            setModal({ show: true, message: "Une erreur s'est produite. Veuillez réessayer.", type: 'error' });
        }
    };

    const closeModal = () => {
        setModal({ show: false, message: '', type: 'success', title: null, btnText: null, onClose: null });
        if (modal.onClose) modal.onClose();
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingReview) return;

        setIsSubmittingReview(true);
        try {
            const response = await fetch('https://Satpromax.com/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productWithId.id,
                    username: reviewForm.username || 'Anonyme',
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                    status: 'pending'
                })
            });

            const data = await response.json();
            if (data.success) {
                setModal({
                    show: true,
                    title: "votre avi Reçue",
                    message: "Votre avis a été envoyé avec succès ! Il sera publié après validation par l'administrateur.",
                    type: 'success'
                });
                setReviewModalOpen(false);
                setReviewForm({
                    username: user ? user.username : '',
                    comment: '',
                    rating: 5
                });
            } else {
                setModal({ show: true, message: data.message || "Une erreur est survenue lors de l'envoi de l'avis.", type: 'error' });
            }
        } catch (error) {
            console.error("Review error:", error);
            setModal({ show: true, message: "Erreur de connexion au serveur.", type: 'error' });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Category Mapping for consistent breadcrumbs
    const categoryMapping = {
        'Streaming': { name: 'Streaming', slug: 'streaming' },
        'IPTV Premium': { name: 'Abonnement IPTV', slug: 'iptv-sharing' },
        'Box Android': { name: 'Box Android & Recepteur', slug: 'box-android' },
        'Music': { name: 'Musique', slug: 'music' },
        'Gaming': { name: 'Gaming', slug: 'gaming' },
        'Gift Card': { name: 'Cartes Cadeaux', slug: 'gift-card' },
        'Software': { name: 'Logiciels', slug: 'software' }
    };

    const currentCategory = categoryMapping[product.category] || { name: product.category, slug: product.category.toLowerCase().replace(/ /g, '-') };
    const isIPTVCategory = currentCategory.name === 'Abonnement IPTV' || product.category === 'IPTV Premium';
    const isSharingCategory = product.category.toLowerCase().includes('sharing') || currentCategory.name.toLowerCase().includes('sharing');

    const breadcrumbs = [
        { name: 'Accueil', url: 'https://Satpromax.com/' },
        { name: currentCategory.name, url: `https://Satpromax.com/${currentCategory.slug}` },
        { name: product.name, url: window.location.href }
    ];

    return (
        <div className="page-wrapper">
            <SEO
                title={product.name}
                description={product.description}
                image={product.image}
                canonical={window.location.href}
                type="product"
                schemas={[
                    generateProductSchema(product),
                    generateBreadcrumbSchema(breadcrumbs)
                ]}
            />
            <Header />

            {/* Custom Modal (Same as Checkout) */}
            {modal.show && (
                <div className="checkout-modal-overlay">
                    <div className={`checkout-modal-content ${modal.type}`}>
                        <div className="checkout-modal-icon">
                            {modal.type === 'success' ? (
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ) : (
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            )}
                        </div>
                        <h3 className="checkout-modal-title">{modal.title || (modal.type === 'success' ? 'Commande Reçue !' : 'Attention')}</h3>
                        <p className="checkout-modal-message">{modal.message}</p>
                        <button className="checkout-modal-btn" onClick={closeModal}>
                            {modal.btnText || (modal.type === 'success' ? (user ? 'Voir mon profil' : 'Contenu achat') : 'Fermer')}
                        </button>
                    </div>
                </div>
            )}

            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link to="/" className="breadcrumb-item">Accueil</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to={`/${currentCategory.slug}`} className="breadcrumb-item">{currentCategory.name}</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-item active">{product.name}</span>
                    </div>

                    <div className="product-detail-grid">
                        {/* Left: Image */}
                        <div className="product-image-section">
                            <div className="detail-image-wrapper">
                                {/* Zoom Icon */}
                                <div className="zoom-icon" onClick={() => setIsZoomOpen(true)}>⛶</div>
                                {product.promoPrice && new Date(product.promoEndDate) > new Date() && (
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', zIndex: 5, pointerEvents: 'none' }}>
                                        <img src="https://i.ibb.co/4x2XwJy/pngtree-special-promo-banner-shape-vector-png-image-7113277.png" alt="Promo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                )}
                                <img src={activeImage || product.image} alt={product.name} className="main-display-image" key={activeImage} />
                            </div>

                            {/* Gallery Thumbnails */}
                            {product.gallery && Array.isArray(product.gallery) && product.gallery.filter(img => img && img.trim() !== '').length > 0 && (
                                <div className="product-gallery-thumbnails">
                                    {/* Main Image as First Thumbnail */}
                                    <div
                                        className={`thumbnail-item ${activeImage === product.image ? 'active' : ''}`}
                                        onClick={() => setActiveImage(product.image)}
                                    >
                                        <img src={product.image} alt="Main" />
                                    </div>

                                    {/* Additional Gallery Images */}
                                    {product.gallery.filter(img => img && img.trim() !== '').map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className={`thumbnail-item ${activeImage === imgUrl ? 'active' : ''}`}
                                            onClick={() => setActiveImage(imgUrl)}
                                        >
                                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Full Screen Zoom Overlay */}
                        {isZoomOpen && (
                            <div className="image-zoom-overlay" onClick={() => setIsZoomOpen(false)}>
                                <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="zoom-close" onClick={() => setIsZoomOpen(false)}>×</button>
                                    <img src={activeImage || product.image} alt={product.name} className="zoomed-image" />
                                </div>
                            </div>
                        )}

                        {/* Right: Info */}
                        {/* Right: Info */}
                        <div className="product-info-section">
                            <h1 className="detail-title" style={{ color: settings?.productTitleColor || 'inherit', marginBottom: '8px' }}>{product.name}</h1>

                            {/* Star Rating Summary */}
                            <div
                                onClick={scrollToReviews}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                    padding: '5px 0'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {renderStars(calculateAverageRating(), '18px')}
                                </div>
                                <h6 style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', margin: 0 }}>
                                    {reviews.length} Avis
                                </h6>
                            </div>

                            {/* Trustpilot Widget */}
                            <div
                                className="trustpilot-widget"
                                data-locale="en-US"
                                data-template-id="56278e9abfbbba0bdcd568bc"
                                data-businessunit-id="69693f33a1c7054e87aa85b8"
                                data-style-height="52px"
                                data-style-width="100%"
                                data-token="2a0b3e50-b416-4a8e-be20-5d3da4454f2d"
                                style={{ transform: 'scale(0.8)', transformOrigin: 'left center', marginBottom: '15px' }}
                            >
                                <a href="https://www.trustpilot.com/review/Satpromax.com" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                            </div>

                            {product.promoPrice && new Date(product.promoEndDate) > new Date() ? (
                                <div className="detail-price">
                                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '24px', marginRight: '15px', fontWeight: '600' }}>
                                        {product.price}
                                    </span>
                                    <span style={{ color: '#ef4444' }}>
                                        {product.promoPrice}
                                    </span>
                                </div>
                            ) : (
                                <h3 className="detail-price">
                                    {product.price}
                                </h3>
                            )}

                            <div className={`stock-status ${product.inStock !== false ? 'in-stock' : 'out-of-stock'}`}>
                                <div className="stock-dot"></div>
                                {product.inStock !== false ? 'Disponible' : 'Épuisé'}
                            </div>

                            {/* {product.hasDelivery && product.deliveryPrice && (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#ecfdf5',
                                    color: '#059669',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    border: '1px solid #a7f3d0'
                                }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                    Livraison: {product.deliveryPrice}
                                </div>
                            )} */}

                            {isIPTVCategory && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                    {product.downloadLink && (
                                        <button
                                            className="download-app-btn"
                                            onClick={() => {
                                                window.location.href = product.downloadLink;
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '12px 25px',
                                                background: 'rgb(126, 34, 206)',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                width: 'fit-content'
                                            }}
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                            Télécharger App
                                        </button>
                                    )}
                                    <Link
                                        to="/guide-installation"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '12px 25px',
                                            background: '#fef3c7',
                                            border: '1px solid #fde68a',
                                            borderRadius: '12px',
                                            color: '#92400e',
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            width: 'fit-content'
                                        }}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Guide d'installation
                                    </Link>
                                </div>
                            )}

                            {isIPTVCategory && (
                                <div className="detail-meta-info">
                                    <div className="meta-info-item">
                                        <h5 className="meta-label">Durée:</h5>
                                        <h5 className="meta-value">12 mois</h5>
                                    </div>
                                    {product.resolution && (
                                        <div className="meta-info-item">
                                            <span className="meta-label">Résolution:</span>
                                            <span className="meta-value">{product.resolution}</span>
                                        </div>
                                    )}
                                    {product.region && (
                                        <div className="meta-info-item">
                                            <span className="meta-label">Région:</span>
                                            <span className="meta-value">{product.region}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="detail-description">
                                <div style={{ whiteSpace: 'pre-wrap' }}>{product.description}</div>
                            </div>

                            {isIPTVCategory && (
                                <div className="product-options">
                                    <div className="option-row">
                                        <label>{"Choix d'appareil"}</label>
                                        <select
                                            className="option-select"
                                            value={selectedDevice}
                                            onChange={(e) => setSelectedDevice(e.target.value)}
                                            required
                                        >
                                            <option value="">Choisir une option</option>
                                            {deviceChoices.length > 0 ? (
                                                deviceChoices.map((choice, index) => (
                                                    <option key={index} value={choice}>{choice}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="Smart TV">Smart TV</option>
                                                    <option value="Android Box">Android Box</option>
                                                    <option value="Smartphone/Tablet">Smartphone/Tablet</option>
                                                    <option value="PC/Laptop">PC/Laptop</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {isSharingCategory && (
                                <div className="product-options">
                                    <div className="option-row">
                                        <label>{"Numéro de série du récepteur *"}</label>
                                        <input
                                            type="text"
                                            className="option-select" // using same class for consistency
                                            placeholder="S/N de votre récepteur"
                                            value={receiverSerial}
                                            onChange={(e) => setReceiverSerial(e.target.value)}
                                            required
                                            style={{ padding: '12px' }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="add-to-cart-section">
                                <div className="qty-input">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        <svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="16" height="2" rx="1" fill="currentColor" />
                                        </svg>
                                    </button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={() => setQuantity(quantity + 1)}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z" fill="currentColor" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    className="btn-add-cart"
                                    onClick={() => {
                                        if (isIPTVCategory && !selectedDevice) {
                                            setModal({ show: true, message: "Veuillez choisir votre appareil avant d'ajouter au panier.", type: 'error' });
                                            return;
                                        }
                                        if (isSharingCategory && !receiverSerial) {
                                            setModal({ show: true, message: "Veuillez entrer le numéro de série de votre récepteur.", type: 'error' });
                                            return;
                                        }
                                        addToCart({
                                            ...productWithId,
                                            selectedDevice: isIPTVCategory ? selectedDevice : null,
                                            receiverSerial: isSharingCategory ? receiverSerial : null
                                        }, quantity);
                                    }}
                                >
                                    AJOUTER AU PANIER
                                </button>
                            </div>

                            {/* Order Details Form - Always shown */}
                            <div className="order-form-container" style={{ position: 'relative' }}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-input"
                                        name="name"
                                        placeholder="Nom complet *"
                                        value={billingInfo.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <select
                                            className="form-input"
                                            style={{ width: '140px', paddingRight: '5px', textOverflow: 'ellipsis' }}
                                            value={selectedCountryCode}
                                            onChange={(e) => {
                                                setSelectedCountryCode(e.target.value);
                                                setBillingInfo(prev => ({ ...prev, whatsapp: e.target.value + localWhatsapp }));
                                            }}
                                        >
                                            {countryCodes.map((c, i) => (
                                                <option key={i} value={c.code}>
                                                    {c.country} ({c.code})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            name="localWhatsapp"
                                            placeholder="Numéro WhatsApp *"
                                            value={localWhatsapp}
                                            onChange={(e) => {
                                                setLocalWhatsapp(e.target.value);
                                                setBillingInfo(prev => ({ ...prev, whatsapp: selectedCountryCode + e.target.value }));
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>Mode de paiement *</label>
                                    <div className="payment-modes-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                        gap: '12px',
                                        marginTop: '10px'
                                    }}>
                                        {paymentModes.map((mode, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`payment-mode-btn ${billingInfo.paymentMode === mode.name ? 'active' : ''}`}
                                                onClick={() => setBillingInfo({ ...billingInfo, paymentMode: mode.name })}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '15px 10px',
                                                    background: billingInfo.paymentMode === mode.name ? '#f0f9ff' : '#fff',
                                                    border: billingInfo.paymentMode === mode.name ? '2.5px solid #0ea5e9' : '1px solid #e2e8f0',
                                                    borderRadius: '16px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    gap: '8px',
                                                    minHeight: '90px',
                                                    position: 'relative',
                                                    boxShadow: billingInfo.paymentMode === mode.name ? '0 10px 15px -3px rgba(14, 165, 233, 0.1)' : 'none'
                                                }}
                                            >
                                                {billingInfo.paymentMode === mode.name && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '6px',
                                                        right: '6px',
                                                        background: '#0ea5e9',
                                                        color: '#fff',
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}>
                                                        ✓
                                                    </div>
                                                )}
                                                <div style={{ height: '35px', display: 'flex', alignItems: 'center' }}>
                                                    {mode.logo ? (
                                                        <img src={mode.logo} alt={mode.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                    ) : (
                                                        <div style={{ fontSize: '24px' }}>💳</div>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: billingInfo.paymentMode === mode.name ? '#0369a1' : '#1e293b', textAlign: 'center' }}>{mode.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                </div>

                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>Prix des produits</span>
                                        <span>{product.price}</span>
                                    </div>
                                    {product.hasDelivery && product.deliveryPrice && (
                                        <div className="summary-row">
                                            <span>Livraison</span>
                                            <span>{product.deliveryPrice}</span>
                                        </div>
                                    )}
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>
                                            {
                                                (() => {
                                                    const total = (parseInt(String(product.price).replace(/[^0-9]/g, '')) * quantity) +
                                                        ((product.hasDelivery && product.deliveryPrice)
                                                            ? (parseInt(String(product.deliveryPrice).replace(/[^0-9]/g, '')) || 0)
                                                            : 0);

                                                    const totalStr = String(total);
                                                    if (totalStr.length > 3) {
                                                        return totalStr.slice(0, -3) + '.' + totalStr.slice(-3);
                                                    }
                                                    return totalStr;
                                                })()
                                            } DT
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="btn-confirm-order"
                                    onClick={handleConfirmOrder}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Commande Express
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            <div className="review-action">
                                <button className="btn-review" onClick={() => setReviewModalOpen(true)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    Laisser un avis
                                </button>
                            </div>

                            <div className="meta-actions">
                                <button className="meta-action-btn" onClick={() => addToWishlist(productWithId)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    Ajouter à la liste
                                </button>
                                <button className="meta-action-btn" onClick={handleCompare}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                    Comparer
                                </button>
                                <button className="meta-action-btn" onClick={() => setShareModalOpen(true)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    Partager
                                </button>
                            </div>

                            <hr className="divider" />

                            <div className="product-meta">
                                <div className="meta-row"><span className="label">SKU:</span> <span className="value">{product.sku}</span></div>
                                <div className="meta-row"><span className="label">Catégories:</span> <span className="value link">{product.name}, {currentCategory.name}</span></div>
                                <div className="meta-row"><span className="label">Tags:</span> <span className="value">{product.tags}</span></div>
                            </div>
                        </div>
                    </div>


                </div>
            </main>

            {shareModalOpen && (
                <div className="checkout-modal-overlay" onClick={() => setShareModalOpen(false)} style={{ zIndex: 9999 }}>
                    <div className="checkout-modal-content share-modal-premium" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '30px', padding: '40px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ marginBottom: '25px', color: '#1e293b', fontSize: '24px', fontWeight: '800' }}>Partager ce produit</h3>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
                            <button
                                onClick={shareOnFacebook}
                                style={{
                                    background: '#1877F2',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '15px',
                                    flex: 1,
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                Facebook
                            </button>
                            <button
                                onClick={shareOnTelegram}
                                style={{
                                    background: '#0088cc',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '15px',
                                    flex: 1,
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.84 8.783c-.156 1.353-.846 5.424-1.22 7.42-.158.844-.468 1.127-.77 1.155-.654.06-1.15-.436-1.784-.852-1.012-.662-1.583-1.074-2.564-1.72-1.135-.747-.4-.1.1.258.118.083.22.155.32 0s2.176-1.996 2.508-2.584c.062-.11.122-.224.062-.284-.06-.06-.217-.037-.3-.024-.136.02-.797.23-2.18.57-.306.075-.584.11-.833.106-.25-.004-.73-.14-1.088-.256-.438-.142-.786-.218-.756-.46.016-.126.19-.255.525-.386 2.05-.892 3.42-1.48 4.108-1.765 1.964-.816 2.372-.958 2.638-.963.058-.002.19.013.275.083.072.06.092.143.1.206.013.064.02.195.01.306z" /></svg>
                                Telegram
                            </button>
                        </div>
                        <button onClick={() => setShareModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', width: 'auto', fontWeight: '600', fontSize: '16px', padding: '10px 20px', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#1e293b'} onMouseOut={(e) => e.target.style.color = '#64748b'}>Fermer</button>
                    </div>
                </div>
            )}

            {/* Comparison Modal */}
            {compareModalOpen && compareProduct && (
                <div className="checkout-modal-overlay" onClick={() => setCompareModalOpen(false)} style={{ zIndex: 9999 }}>
                    <div className="checkout-modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '90%', maxWidth: '800px', borderRadius: '24px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#0f172a', fontWeight: '900' }}>Comparaison de Produits</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ background: '#f8fafc', padding: '20px' }}></div>
                            <div style={{ textAlign: 'center', background: '#fff', padding: '20px' }}>
                                <img src={compareProduct.image} alt={compareProduct.name} style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '15px' }} />
                                <h4 style={{ fontSize: '16px', color: '#0f172a' }}>{compareProduct.name}</h4>
                            </div>
                            <div style={{ textAlign: 'center', background: '#fff', padding: '20px' }}>
                                <img src={product.image} alt={product.name} style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '15px' }} />
                                <h4 style={{ fontSize: '16px', color: '#0f172a' }}>{product.name}</h4>
                            </div>

                            <div style={{ fontWeight: 'bold', padding: '15px 20px', background: '#f8fafc', color: '#64748b' }}>Prix</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff', fontWeight: '800', color: '#ef4444' }}>{compareProduct.price}</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff', fontWeight: '800', color: '#ef4444' }}>{product.price}</div>

                            <div style={{ fontWeight: 'bold', padding: '15px 20px', background: '#f8fafc', color: '#64748b' }}>Catégorie</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff' }}>{compareProduct.category}</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff' }}>{product.category}</div>

                            <div style={{ fontWeight: 'bold', padding: '15px 20px', background: '#f8fafc', color: '#64748b' }}>Description</div>
                            <div style={{ fontSize: '13px', padding: '15px 20px', background: '#fff', lineHeight: '1.6' }}>{compareProduct.description}</div>
                            <div style={{ fontSize: '13px', padding: '15px 20px', background: '#fff', lineHeight: '1.6' }}>{product.description}</div>

                            <div style={{ fontWeight: 'bold', padding: '15px 20px', background: '#f8fafc', color: '#64748b' }}>SKU</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff', fontFamily: 'monospace' }}>{compareProduct.sku}</div>
                            <div style={{ textAlign: 'center', padding: '15px 20px', background: '#fff', fontFamily: 'monospace' }}>{product.sku}</div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => { setCompareModalOpen(false); localStorage.removeItem('compare_product'); }} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px 25px', borderRadius: '14px', cursor: 'pointer', fontWeight: '700' }}>Réinitialiser</button>
                            <button onClick={() => setCompareModalOpen(false)} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '14px', cursor: 'pointer', fontWeight: '700' }}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Rich Description Section */}
            {(product.descriptionGlobal || (product.extraSections && product.extraSections.length > 0)) && (
                <section className="product-rich-description" style={{
                    padding: '80px 0',
                    background: '#fff',
                    borderTop: '1px solid #f1f5f9'
                }}>
                    <div className="container" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '0 20px',
                        direction: 'ltr' // Keeping it LTR as per the French content example
                    }}>
                        {/* Tab-like Title */}
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            borderBottom: '1px solid #e2e8f0',
                            marginBottom: '40px'
                        }}>
                            <div style={{
                                padding: '10px 0',
                                fontSize: '18px',
                                fontWeight: '800',
                                color: '#0f172a',
                                borderBottom: '3px solid #fbbf24',
                                marginBottom: '-1px'
                            }}>
                                Description
                            </div>
                        </div>

                        {/* Global Description */}
                        {product.descriptionGlobal && (
                            <div style={{ marginBottom: '50px' }}>
                                <div
                                    style={{
                                        fontSize: '19px',
                                        color: '#475569',
                                        lineHeight: '1.8',
                                        fontWeight: '500'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: product.descriptionGlobal.replace(/\n/g, '<br/>') }}
                                />
                            </div>
                        )}

                        {/* Extra Sections */}
                        {product.extraSections && product.extraSections.map((section, index) => (
                            <div key={index} style={{ marginBottom: '50px' }}>
                                <h2 style={{



                                    fontSize: '32px',
                                    fontWeight: '900',
                                    color: '#0f172a',
                                    marginBottom: '25px',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1.2'
                                }}>
                                    {section.title}
                                </h2>
                                <div style={{ fontSize: '17px', color: '#334155', lineHeight: '1.7' }}>
                                    {section.items ? (
                                        // New Format: Array of items
                                        section.items.map((item, itemIdx) => (
                                            <div key={itemIdx} style={{ marginBottom: item.type === 'subtitle' ? '15px' : '20px' }}>
                                                {item.type === 'subtitle' ? (
                                                    <h3 style={{
                                                        fontSize: '22px',
                                                        fontWeight: '800',
                                                        color: '#1e293b',
                                                        marginBottom: '10px',
                                                        marginTop: itemIdx === 0 ? '0' : '20px',
                                                        paddingLeft: '12px',
                                                        borderLeft: '4px solid #fbbf24'
                                                    }}>
                                                        {item.content}
                                                    </h3>
                                                ) : (
                                                    <div
                                                        style={{ color: '#475569' }}
                                                        dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br/>') }}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        // Old Format: backward compatibility
                                        <div
                                            style={{ color: '#475569' }}
                                            dangerouslySetInnerHTML={{ __html: section.content ? section.content.replace(/\n/g, '<br/>') : '' }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Detailed Reviews Section - Moved under Description */}
            <section className="product-reviews-section" style={{ padding: '40px 0', background: '#fafafa' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div
                        id="reviews-section"
                        ref={reviewsSectionRef}
                        style={{
                            padding: '40px',
                            background: '#fff',
                            borderRadius: '32px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '30px' }}>Avis clients</h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '40px',
                                alignItems: 'center'
                            }}>
                                {/* Left Side: Big Score */}
                                <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '24px' }}>
                                    <div style={{ fontSize: '64px', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>
                                        {calculateAverageRating()} <span style={{ fontSize: '24px', color: '#94a3b8', fontWeight: '600' }}>/ 5</span>
                                    </div>
                                    <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                        {renderStars(calculateAverageRating(), '24px')}
                                    </div>
                                    <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '600' }}>Basé sur {reviews.length} avis</div>
                                </div>

                                {/* Right Side: Distribution Bars */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                        return (
                                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '60px' }}>
                                                    <span style={{ fontWeight: '700', fontSize: '14px' }}>{star}</span>
                                                    <span style={{ color: '#fbbf24' }}>★</span>
                                                </div>
                                                <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${percentage}%`, height: '100%', background: '#fbbf24', borderRadius: '10px' }}></div>
                                                </div>
                                                <div style={{ minWidth: '40px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{count}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                            <button
                                className="btn-confirm-order"
                                onClick={() => setReviewModalOpen(true)}
                                style={{ width: 'auto', padding: '12px 30px', borderRadius: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                Rédiger un avis
                            </button>
                        </div>

                        {reviews.length > 0 ? (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {reviews.map((rev) => (
                                    <div
                                        key={rev._id}
                                        style={{
                                            padding: '25px',
                                            background: '#f8fafc',
                                            borderRadius: '20px',
                                            border: '1px solid #f1f5f9'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    background: '#e2e8f0',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#475569'
                                                }}>
                                                    {rev.username ? rev.username.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <h5 style={{ fontWeight: '800', color: '#0f172a', margin: 0 }}>{rev.username}</h5>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(rev.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {renderStars(rev.rating)}
                                            </div>
                                        </div>
                                        <p style={{ color: '#334155', lineHeight: '1.6', margin: 0 }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                background: '#f8fafc',
                                borderRadius: '24px',
                                color: '#64748b'
                            }}>
                                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '15px', color: '#cbd5e1' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                <h5 style={{ fontWeight: '600', margin: '0 0 10px' }}>Aucun avis pour le moment.</h5>
                                <p style={{ fontSize: '14px' }}>Soyez le premier à partager votre expérience !</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
                <section className="similar-products" style={{ marginTop: '80px', padding: '60px 0', background: '#fafafa' }}>
                    <div className="container" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '0 10px' }}>
                            <h2 className='Produits-s' style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px' }}>Produits Similaires</h2>
                            <Link to={`/${product.category.toLowerCase().replace(/ & /g, '-').replace(/[ /]/g, '-')}`} style={{
                                color: '#64748b',
                                fontWeight: '700',
                                textDecoration: 'none',
                                fontSize: '14px',
                                background: '#fff',
                                padding: '8px 20px',
                                borderRadius: '50px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s'
                            }}
                                onMouseOver={(e) => e.target.style.borderColor = '#0ea5e9'}
                                onMouseOut={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                Voir tout
                            </Link>
                        </div>

                        {/* Carousel Wrapper */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            {/* Left Arrow */}
                            <button
                                onClick={() => scrollCarousel('left')}
                                style={{
                                    position: 'absolute',
                                    left: '-20px',
                                    zIndex: 10,
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            {/* Scrollable Area */}
                            <div
                                ref={carouselRef}
                                className="similar-products-carousel"
                                style={{
                                    display: 'flex',
                                    overflowX: 'auto',
                                    gap: '15px',
                                    padding: '10px 0 30px 0',
                                    scrollSnapType: 'x mandatory',
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none',
                                    width: '100%',
                                    position: 'relative'
                                }}
                            >
                                {similarProducts.map(item => (
                                    <div key={item._id || item.id} style={{ scrollSnapAlign: 'start' }}>
                                        <SimilarProductCard
                                            item={item}
                                            addToCart={addToCart}
                                            setModal={setModal}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => scrollCarousel('right')}
                                style={{
                                    position: 'absolute',
                                    right: '-20px',
                                    zIndex: 10,
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>

                    <style>{`
                        .similar-products-carousel::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </section>
            )}

            {/* Review Modal */}
            {
                reviewModalOpen && (
                    <div className="modal-overlay" style={{ zIndex: 2000 }}>
                        <div className="modal-content review-modal" style={{ maxWidth: '450px', padding: '30px' }}>
                            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Laisser un avis</h2>
                            <form onSubmit={handleReviewSubmit}>
                                {!user && (
                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Votre Nom</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={reviewForm.username}
                                            onChange={(e) => setReviewForm({ ...reviewForm, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Note</label>
                                    <div style={{ display: 'flex', gap: '5px', fontSize: '24px', color: '#fbbf24' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            >
                                                {star <= reviewForm.rating ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Votre Commentaire</label>
                                    <textarea
                                        className="form-input"
                                        style={{ height: '120px', resize: 'none' }}
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-confirm-order" disabled={isSubmittingReview} style={{ flex: 1 }}>
                                        {isSubmittingReview ? "Envoi..." : "Envoyer"}
                                    </button>
                                    <button type="button" className="btn-confirm-order" onClick={() => setReviewModalOpen(false)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }}>
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <Footer />
        </div>
    );
}
