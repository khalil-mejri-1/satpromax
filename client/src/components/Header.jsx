import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import { API_BASE_URL } from '../config';
import TwoFactorSetup from './TwoFactorSetup';
import './Header.css';

// Simple SVG Icons
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
// ... (keep other icons roughly the same, but the tool replaces blocks)
// I will just supply the UserIcon here again to be safe with the chunk
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const NavIcon = ({ name }) => {
    // You could replace these with specific icons for each category
    return <div className="nav-icon-placeholder" />
}

// Professional Icons matching reference
const StreamingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V16C1 17.1046 1.89543 18 3 18H21C22.1046 18 23 17.1046 23 16V6C23 4.89543 22.1046 4 21 4Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
        <path d="M8 22H16" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 18V22" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <rect x="3" y="6" width="18" height="10" rx="0.5" fill="#60A5FA" fillOpacity="0.2" />
    </svg>
);

const IPTVIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4C2.89543 4 2 4.89543 2 6V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V6C22 4.89543 21.1046 4 20 4Z" fill="#0EA5E9" fillOpacity="0.8" />
        <path d="M8 21H16" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 17V21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 10.5L10 12.5L7 14.5V10.5Z" fill="white" />
    </svg>
);

const MusicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10V16C3 18.2091 4.79086 20 7 20H8V11H5C4.44772 11 4 10.5523 4 10V9C4 5.68629 6.68629 3 10 3H14C17.3137 3 20 5.68629 20 9V10C20 10.5523 19.5523 11 19 11H16V20H17C19.2091 20 21 18.2091 21 16V10M7 20H5" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11V20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 11V20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="9" width="16" height="12" rx="2" fill="#8B5CF6" />
        <path d="M8 8L6 5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 8L18 5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="13" r="1.5" fill="#4C1D95" />
        <circle cx="15" cy="13" r="1.5" fill="#4C1D95" />
    </svg>
);

const GamingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.09526 13.9116C3.12596 9.6834 5.75336 5.48316 9.92348 4.49842C11.272 4.17997 12.6713 4.15682 14.0298 4.45347C18.225 5.36952 20.9161 9.56942 20.0468 13.8188L19.4975 16.5042C19.1627 18.1415 17.5898 19.229 15.9472 18.9602L15.3528 18.8629L14.7702 18.7676C13.5684 18.571 12.4285 19.141 11.9015 20.2078V20.2078C11.2299 21.5672 9.58406 22.0945 8.24357 21.3794C6.91896 20.6728 6.42718 19.0068 7.15939 17.6534L8.03816 16.0291L4.09526 13.9116Z" fill="#6366F1" />
        <path d="M8 12L10 12" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 11L9 13" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="10" r="1" fill="#FCA5A5" />
        <circle cx="17" cy="12" r="1" fill="#FCD34D" />
    </svg>
);

const GiftCardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2" fill="#0EA5E9" />
        <path d="M2 10H22" stroke="#0369A1" strokeWidth="2" />
        <rect x="5" y="14" width="8" height="2" rx="0.5" fill="white" fillOpacity="0.5" />
    </svg>
);

const SoftwareIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="4" width="10" height="16" rx="5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M12 4V9" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const GuideIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SupportIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11V15C5 15.5523 5.44772 16 6 16H8C8.55228 16 9 15.5523 9 15V11C9 10.4477 8.55228 10 8 10H7C7.35622 7.82869 9.07923 6 12 6C14.9208 6 16.6438 7.82869 17 10H16C15.4477 10 15 10.4477 15 11V15C15 15.5523 15.4477 16 16 16H18C18.5523 16 19 15.5523 19 15V11Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5V11C22 5.47715 17.5228 1 12 1C6.47715 1 2 5.47715 2 11V14.5C2 16.9853 4.01472 19 6.5 19C7.05445 19 7.5 19.4455 7.5 20V21C7.5 22.1046 8.39543 23 9.5 23H14.5C15.6046 23 16.5 22.1046 16.5 21V20C16.5 19.4455 16.9455 19 17.5 19Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.1" fill="#3B82F6" />
    </svg>
);

export default function Header() {
    const {
        cartItems,
        wishlistItems,
        getCartCount,
        getCartTotal,
        removeFromCart,
        removeFromWishlist,
        getWishlistCount,
        addAllToCart,
        categories,
        loadingCategories
    } = useContext(ShopContext);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ categories: [], products: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [expandedSidebarCat, setExpandedSidebarCat] = useState(null);
    const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setSearchResults({ categories: [], products: [] });
                setIsSearching(false);
                return;
            }
            try {
                setIsSearching(true);
                const res = await fetch(`${API_BASE_URL}/api/search?q=${searchTerm}`);
                const data = await res.json();
                if (data.success) {
                    // Backend returns { success: true, data: [products] }
                    setSearchResults({ categories: [], products: data.data || [] });
                }
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={index} style={{ fontWeight: 'bold' }}>{part}</span>
                : part
        );
    };

    const [topStripText, setTopStripText] = useState('WhatsApp : 97 490 300'); // Default
    const [topStripMessage, setTopStripMessage] = useState('Bienvenue sur Satpromax !'); // Default
    const [siteLogo, setSiteLogo] = useState('https://i.ibb.co/kRsrFC3/Untitled-design-6-pixian-ai.png'); // Default

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch dynamic settings (Categories handled by Context now)
        fetch(`${API_BASE_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    if (data.data.topStripText) setTopStripText(data.data.topStripText);
                    if (data.data.topStripMessage) setTopStripMessage(data.data.topStripMessage);
                    if (data.data.siteLogo) setSiteLogo(data.data.siteLogo);
                }
            })
            .catch(err => {
                console.error("Error fetching settings:", err);
            });
    }, []);

    // ... (rest of helper functions)
    const getCategorySlug = (name) => {
        if (!name) return "";
        return name.toLowerCase()
            .replace(/ & /g, '-')
            .replace(/[ /]/g, '-');
    };

    const iconMap = {
        'Streaming': <StreamingIcon />,
        'IPTV Premium': <IPTVIcon />,
        'Music': <MusicIcon />,
        'Musique': <MusicIcon />,
        'Box Android': <BoxIcon />,
        'Gaming': <GamingIcon />,
        'Gift Card': <GiftCardIcon />,
        'Cartes Cadeaux': <GiftCardIcon />,
        'Software': <SoftwareIcon />,
        'Logiciels': <SoftwareIcon />
    };

    const getIcon = (cat) => {
        const icon = typeof cat === 'object' ? cat.icon : null;
        const name = typeof cat === 'object' ? cat.name : cat;

        if (icon) {
            if (icon.startsWith('http')) {
                return <img src={icon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />;
            }
            return <span style={{ fontSize: '18px' }}>{icon}</span>;
        }

        return iconMap[name] || <StreamingIcon />;
    };

    const cartCount = getCartCount();
    const wishlistCount = getWishlistCount();
    const cartTotal = getCartTotal();

    return (
        <header className="header">
            {/* Top Strip */}

            <div className="top-strip">
                <div className="container" style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <h5>{topStripText}</h5>
                    <h5 className="scrolling-promo-text">{topStripMessage}</h5>
                </div>
            </div>

            {/* Main Header */}
            <div className="main-header">
                <div className="container header-content">
                    <div className="logo">
                        <Link to="/">
                            {/* <span className="yellow">satpro</span><span className="white">max</span> */}
                            <img src={siteLogo} alt="Satpromax Logo" className='logo-img' />
                        </Link>
                    </div>

                    <div className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <MenuIcon /> MENU
                    </div>

                    <div className="search-bar">
                        <div className="category-select" onClick={() => setIsCategoryModalOpen(!isCategoryModalOpen)}>
                            Toutes les catégories
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isCategoryModalOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                                <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {/* Category Dropdown */}
                            {isCategoryModalOpen && (
                                <div className="category-dropdown-container">
                                    <div className="category-dropdown-header">
                                        Toutes les catégories
                                    </div>
                                    <div className="category-dropdown-list">
                                        {categories.map((cat, index) => {
                                            const name = typeof cat === 'object' ? cat.name : cat;
                                            return (
                                                <Link
                                                    key={index}
                                                    to={`/${getCategorySlug(name)}`}
                                                    className="category-dropdown-link"
                                                    onClick={() => setIsCategoryModalOpen(false)}
                                                >
                                                    {name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Je cherche ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsSearchDropdownOpen(false), 200)}
                            />
                            {isSearchDropdownOpen && (
                                <div className="search-dropdown-container">
                                    <div className="search-dropdown-content">
                                        {isSearching ? (
                                            <div className="search-loading">
                                                <div className="spinner"></div>
                                                <span>Recherche en cours...</span>
                                            </div>
                                        ) : searchTerm.length < 2 ? (
                                            <>
                                                <div className="search-dropdown-hint">
                                                    Commencez à taper pour rechercher...
                                                </div>
                                                <div className="search-suggestions">
                                                    <p className="suggestion-title">Suggestions populaires</p>
                                                    <div className="suggestion-list">
                                                        {categories.slice(0, 4).map((cat, idx) => (
                                                            <Link
                                                                key={idx}
                                                                to={`/${getCategorySlug(typeof cat === 'object' ? cat.name : cat)}`}
                                                                onClick={() => setIsSearchDropdownOpen(false)}
                                                            >
                                                                {typeof cat === 'object' ? cat.name : cat}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="search-results-wrapper">
                                                {/* Categories Section */}
                                                {/* Categories Section - HIDDEN */}
                                                {/* {searchResults.categories.length > 0 && (
                                                    <div className="search-section">
                                                        <h4 className="search-section-title">CATÉGORIES</h4>
                                                        <ul className="search-category-list">
                                                            {searchResults.categories.map((cat, idx) => {
                                                                const name = typeof cat === 'object' ? cat.name : cat;
                                                                return (
                                                                    <li key={idx}>
                                                                        <Link
                                                                            to={`/${getCategorySlug(name)}`}
                                                                            onClick={() => setIsSearchDropdownOpen(false)}
                                                                        >
                                                                            {highlightMatch(name, searchTerm)}
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )} */}

                                                {/* Products Section */}
                                                {searchResults.products.length > 0 && (
                                                    <div className="search-section">
                                                        <h4 className="search-section-title">PRODUITS</h4>
                                                        <div className="search-product-list">
                                                            {searchResults.products.map(product => (
                                                                <Link
                                                                    key={product._id}
                                                                    to={`/${slugify(product.category || 'all')}/${product.slug || slugify(product.name)}`}
                                                                    className="search-product-item"
                                                                    onClick={() => setIsSearchDropdownOpen(false)}
                                                                >
                                                                    <img src={product.image} alt={product.name} />
                                                                    <div className="search-product-info">
                                                                        <div className="search-product-name">
                                                                            {highlightMatch(product.name, searchTerm)}
                                                                        </div>
                                                                        <div className="search-product-price">{product.price}</div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {searchResults.categories.length === 0 && searchResults.products.length === 0 && (
                                                    <div className="no-results">Aucun résultat trouvé pour "{searchTerm}"</div>
                                                )}

                                                {/* {searchResults.products.length > 0 && (
                                                    <div className="see-all-results">
                                                        <Link to={`/search?q=${searchTerm}`} onClick={() => setIsSearchDropdownOpen(false)}>
                                                            SEE ALL PRODUCTS... ({searchResults.products.length})
                                                        </Link>
                                                    </div>
                                                )} */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="search-btn"><SearchIcon /></button>
                    </div>

                    <div className="user-actions">
                        {user ? (
                            <div className="action-item dropdown-parent">
                                <UserIcon />
                                <div className="action-text">
                                    <h5 className="small" style={{ fontSize: '11px', margin: 0, fontWeight: 500 }}>Bonjour</h5>
                                    <h5 className="bold" style={{ textTransform: 'capitalize', fontSize: '13px', margin: 0, fontWeight: 700 }}>{user.username}</h5>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="mini-dropdown profile-dropdown">
                                    <div className="dropdown-header">Mon Compte</div>
                                    <div className="dropdown-items">
                                        <Link to="/profile" className="dropdown-item">
                                            <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                <UserIcon />
                                            </div>
                                            <div className="item-info">
                                                <div className="item-name" style={{ color: '#333' }}>Mon Profil</div>
                                                <div className="item-meta">Gérer mon compte</div>
                                            </div>
                                        </Link>

                                        {user && user.role === 'admin' && (
                                            <Link to="/admin" className="dropdown-item">
                                                <div style={{ width: '50px', height: '50px', background: '#fff7ed', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <div className="item-info">
                                                    <div className="item-name" style={{ color: '#f97316' }}>Tableau de Bord</div>
                                                    <div className="item-meta">Administration site</div>
                                                </div>
                                            </Link>
                                        )}

                                        <div className="dropdown-item" onClick={(e) => {
                                            e.preventDefault();
                                            setIs2FASetupOpen(true);
                                        }} style={{ cursor: 'pointer' }}>
                                            <div style={{ width: '50px', height: '50px', background: '#ecfdf5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </div>
                                            <div className="item-info">
                                                <div className="item-name" style={{ color: '#10b981' }}>Sécurité 2FA</div>
                                                <div className="item-meta">{user.twoFactorEnabled ? 'Gérer / Désactiver' : 'Activer 2FA'}</div>
                                            </div>
                                        </div>

                                        <div className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                localStorage.removeItem('user');
                                                setUser(null);
                                                window.location.reload();
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div style={{ width: '50px', height: '50px', background: '#fee2e2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            </div>
                                            <div className="item-info">
                                                <div className="item-name" style={{ color: '#ef4444' }}>Déconnexion</div>
                                                <div className="item-meta">Se déconnecter</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="action-item">
                                <UserIcon />
                                <div className="action-text">
                                    <h6 className="small" style={{ fontSize: '11px', margin: 0 }}>Connexion</h6>
                                    <h5 className="bold" style={{ fontSize: '13px', margin: 0 }}>Mon Compte</h5>
                                </div>
                            </Link>
                        )}

                        <div className="action-item dropdown-parent" onClick={() => {
                            if (window.innerWidth <= 591) {
                                setIsWishlistModalOpen(true);
                            }
                        }}>
                            <div className="icon-badge-wrapper">
                                <HeartIcon />
                                <span className="badge">{wishlistCount}</span>
                            </div>
                            <div className="action-text">
                                <h6 className="small_s" style={{ fontSize: '11px', margin: 0, fontWeight: 500 }}>Favoris</h6>
                                <h5 className="bold" style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>Ma Liste</h5>
                            </div>

                            {/* Wishlist Dropdown (Desktop) */}
                            <div className="mini-dropdown wishlist-dropdown">
                                <div className="dropdown-header">Ma Liste</div>
                                <div className="dropdown-items">
                                    {wishlistItems.length === 0 ? (
                                        <p className="empty-msg">Votre liste est vide.</p>
                                    ) : (
                                        wishlistItems.map(item => (
                                            <div key={item.id} className="dropdown-item">
                                                <img src={item.image} alt={item.name} />
                                                <div className="item-info">
                                                    <div className="item-name">{item.name}</div>
                                                    <div className="item-price">{item.price}</div>
                                                </div>
                                                <button className="remove-btn" onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation(); // Prevent modal opening if removing
                                                    removeFromWishlist(item.id);
                                                }}>×</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {wishlistItems.length > 0 && (
                                    <div className="dropdown-footer">
                                        <button
                                            className="btn-add-all-cart"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addAllToCart(wishlistItems);
                                            }}
                                        >
                                            AJOUTER TOUT AU PANIER
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Wishlist Modal */}
                        {isWishlistModalOpen && (
                            <div className="mobile-modal-overlay" onClick={() => setIsWishlistModalOpen(false)}>
                                <div className="mobile-modal-content" onClick={e => e.stopPropagation()}>
                                    <div className="mobile-modal-header">
                                        <h3>Ma Liste ({wishlistCount})</h3>
                                        <button className="close-modal-btn" onClick={() => setIsWishlistModalOpen(false)}>×</button>
                                    </div>
                                    <div className="mobile-modal-body">
                                        {wishlistItems.length === 0 ? (
                                            <div className="empty-state">
                                                <span style={{ fontSize: '40px' }}>♡</span>
                                                <p>Votre liste est vide.</p>
                                            </div>
                                        ) : (
                                            <>
                                                {wishlistItems.map(item => (
                                                    <div key={item.id} className="mobile-product-item">
                                                        <Link to={`/${slugify(item.category || 'all')}/${item.slug || slugify(item.name)}`}>
                                                            <img src={item.image} alt={item.name} />
                                                        </Link>
                                                        <div className="mobile-item-info">
                                                            <Link to={`/${slugify(item.category || 'all')}/${item.slug || slugify(item.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                <h4>{item.name}</h4>
                                                            </Link>
                                                            <span className="mobile-item-price">{item.price}</span>
                                                        </div>
                                                        <button className="mobile-remove-btn" onClick={() => removeFromWishlist(item.id)}>Retirer</button>
                                                    </div>
                                                ))}
                                                <div className="mobile-modal-footer">
                                                    <button
                                                        className="btn-add-all-cart"
                                                        onClick={() => {
                                                            addAllToCart(wishlistItems);
                                                            setIsWishlistModalOpen(false);
                                                        }}
                                                    >
                                                        AJOUTER TOUT DANS PANIER
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="action-item dropdown-parent">
                            <Link to="/checkout" className="action-link-wrapper">
                                <div className="icon-badge-wrapper">
                                    <CartIcon />
                                    <span className="badge">{cartCount}</span>
                                </div>
                                <div className="action-text">
                                    <h6 className="small_ss" style={{ fontSize: '11px', margin: 0, fontWeight: 500 }}>Votre Panier</h6>
                                    <h5 className="bold" style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>{cartTotal} DT</h5>
                                </div>
                            </Link>

                            {/* Cart Dropdown */}
                            <div className="mini-dropdown cart-dropdown">
                                <div className="dropdown-header">Votre Panier</div>
                                <div className="dropdown-items">
                                    {cartItems.length === 0 ? (
                                        <p className="empty-msg">Votre panier est vide.</p>
                                    ) : (
                                        cartItems.map(item => (
                                            <div key={item.id} className="dropdown-item">
                                                <img src={item.image} alt={item.name} />
                                                <div className="item-info">
                                                    <Link to={`/${slugify(item.category || 'all')}/${item.slug || slugify(item.name)}`} className="item-name">{item.name}</Link>
                                                    <div className="item-meta">{item.quantity} × <span className="price-bold">{item.price}</span></div>
                                                </div>
                                                <button className="remove-btn" onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromCart(item.id);
                                                }}>×</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {cartItems.length > 0 && (
                                    <div className="dropdown-footer">
                                        <div className="subtotal-row">
                                            <span>Sous-total :</span>
                                            <span className="subtotal-amount">{cartTotal} DT</span>
                                        </div>
                                        <Link to="/checkout" className="btn-view-cart">VOIR LE PANIER</Link>
                                        <Link to="/checkout" className="btn-checkout-mini">COMMANDER</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bottom-nav">
                <div className="container nav-links">
                    {loadingCategories ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="nav-link skeleton-button">
                                <div className="skeleton-icon"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((cat, index) => {
                            const name = typeof cat === 'object' ? cat.name : cat;
                            const subcats = typeof cat === 'object' ? cat.subcategories : [];
                            return (
                                <div key={index} className="nav-item-container">
                                    <Link to={`/${getCategorySlug(name)}`} className={`nav-link ${subcats && subcats.length > 0 ? 'has-subs' : ''}`}>
                                        <span className="icon">{getIcon(cat)}</span>
                                        {name}
                                        {subcats && subcats.length > 0 && <span className="arrow-down">▼</span>}
                                    </Link>
                                    {subcats && subcats.length > 0 && (
                                        <div className="subcat-dropdown">
                                            {subcats.map((sub, i) => (
                                                <Link
                                                    key={i}
                                                    to={`/${getCategorySlug(name)}?sub=${slugify(sub)}`}
                                                    className="subcat-link"
                                                >
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <>
                            <Link to="/streaming" className="nav-link"><span className="icon"><StreamingIcon /></span> Streaming <span className="arrow"></span></Link>
                            <Link to="/iptv-sharing" className="nav-link"><span className="icon"><IPTVIcon /></span> Abonnement IPTV <span className="arrow"></span></Link>
                            <Link to="/music" className="nav-link"><span className="icon"><MusicIcon /></span> Musique</Link>
                            <Link to="/box-android" className="nav-link"><span className="icon"><BoxIcon /></span> Box Android & Recepteur</Link>
                            <Link to="/gaming" className="nav-link"><span className="icon"><GamingIcon /></span> Gaming</Link>
                            <Link to="/gift-card" className="nav-link"><span className="icon"><GiftCardIcon /></span> Cartes Cadeaux</Link>
                            <Link to="/software" className="nav-link"><span className="icon"><SoftwareIcon /></span> Logiciels</Link>
                        </>
                    )}
                    <Link to="/guide-installation" className="nav-link guide-btn-nav" style={{
                        background: 'rgb(255, 214, 0)',
                        color: '#000000ff',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        border: '1px solid #fde68a'
                    }}>
                        <span className="icon"><GuideIcon /></span>
                        Aide
                    </Link>

                    <Link to="/support" className="nav-link support-btn-nav" style={{
                        background: '#eff6ff',
                        color: '#1e40af',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        border: '1px solid #bfdbfe',
                        marginLeft: '10px'
                    }}>
                        <span className="icon"><SupportIcon /></span>
                        Support
                    </Link>

                    <Link to="/applications" className="nav-link apps-btn-nav" style={{
                        background: '#f5f3ff',
                        color: '#5b21b6',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        border: '1px solid #ddd6fe',
                        marginLeft: '10px'
                    }}>
                        <span className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </span>
                        Applications
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar-menu ${isSidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-header-profile">
                    <div className="profile-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                    {user ? (
                        <>
                            <div className="profile-info">
                                <div className="guest-name" style={{ textTransform: 'capitalize' }}>{user.username}</div>
                                <div className="guest-email">{user.email}</div>
                            </div>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                <button
                                    className="sidebar-login-link"
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        setUser(null);
                                        setIsSidebarOpen(false);
                                        window.location.reload();
                                    }}
                                    style={{ position: 'static', background: 'none', border: 'none', color: '#fcd34d', cursor: 'pointer', textAlign: 'right', padding: 0 }}
                                >
                                    ➜ Déconnexion
                                </button>
                                <button
                                    className="sidebar-login-link"
                                    onClick={() => { setIs2FASetupOpen(true); }}
                                    style={{ position: 'static', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textAlign: 'right', padding: 0, fontSize: '12px', fontWeight: 'bold' }}
                                >
                                    {user.twoFactorEnabled ? '🔐 Gérer 2FA' : '🔐 Activer 2FA'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="profile-info">
                                <div className="guest-name">Invité</div>
                                <div className="guest-email">Bienvenue chez Satpromax</div>
                            </div>
                            <Link to="/login" className="sidebar-login-link" onClick={() => setIsSidebarOpen(false)}>
                                ➜ Connexion
                            </Link>
                        </>
                    )}
                </div>
                <div className="sidebar-main-title">
                    <h3>MENU PRINCIPAL</h3>
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
                </div>
                <div className="sidebar-nav-list">
                    {loadingCategories ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="sidebar-nav-item skeleton-sidebar-item">
                                <div className="skeleton-icon-sidebar"></div>
                                <div className="skeleton-text-sidebar"></div>
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((cat, index) => {
                            const name = typeof cat === 'object' ? cat.name : cat;
                            const subcats = typeof cat === 'object' ? cat.subcategories : [];
                            const isExpanded = expandedSidebarCat === index;

                            return (
                                <div key={index} className="sidebar-nav-group">
                                    <div
                                        className="sidebar-nav-item"
                                        onClick={() => subcats && subcats.length > 0 ? setExpandedSidebarCat(isExpanded ? null : index) : setIsSidebarOpen(false)}
                                    >
                                        <Link to={subcats && subcats.length > 0 ? '#' : `/${getCategorySlug(name)}`} style={{ display: 'flex', alignItems: 'center', flex: 1, textDecoration: 'none', color: 'inherit' }} onClick={(e) => { if (subcats && subcats.length > 0) e.preventDefault(); }}>
                                            <span className="sidebar-icon">{getIcon(cat)}</span>
                                            <span className="sidebar-text">{name}</span>
                                        </Link>
                                        {subcats && subcats.length > 0 ? (
                                            <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', fontSize: '12px' }}>›</span>
                                        ) : (
                                            <span className="sidebar-arrow">›</span>
                                        )}
                                    </div>
                                    {subcats && subcats.length > 0 && isExpanded && (
                                        <div className="sidebar-sub-list" style={{ background: '#f8fafc', paddingLeft: '15px' }}>
                                            {subcats.map((sub, i) => (
                                                <Link
                                                    key={i}
                                                    to={`/${getCategorySlug(name)}?sub=${slugify(sub)}`}
                                                    className="sidebar-nav-item"
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    style={{ fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}
                                                >
                                                    <span className="sidebar-text">{sub}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <>
                            <Link to="/streaming" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><StreamingIcon /></span>
                                <span className="sidebar-text">Streaming</span>
                                <span className="sidebar-arrow">›</span>
                            </Link>
                            <Link to="/iptv-sharing" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><IPTVIcon /></span>
                                <span className="sidebar-text">Abonnement IPTV</span>
                                <span className="sidebar-arrow">›</span>
                            </Link>
                            <Link to="/music" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><MusicIcon /></span>
                                <span className="sidebar-text">Musique</span>
                            </Link>
                            <Link to="/box-android" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><BoxIcon /></span>
                                <span className="sidebar-text">Box Android & Recepteur</span>
                            </Link>
                            <Link to="/gaming" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><GamingIcon /></span>
                                <span className="sidebar-text">Gaming</span>
                            </Link>
                            <Link to="/gift-card" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><GiftCardIcon /></span>
                                <span className="sidebar-text">Cartes Cadeaux</span>
                            </Link>
                            <Link to="/software" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)}>
                                <span className="sidebar-icon"><SoftwareIcon /></span>
                                <span className="sidebar-text">Logiciels</span>
                            </Link>
                        </>
                    )}
                    <Link to="/guide-installation" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)} style={{ marginTop: '10px', background: '#fffbeb' }}>
                        <span className="sidebar-icon"><GuideIcon /></span>
                        <span className="sidebar-text" style={{ color: '#92400e', fontWeight: '700' }}>Guide d'installation</span>
                        <span className="sidebar-arrow">›</span>
                    </Link>
                    <Link to="/support" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)} style={{ marginTop: '10px', background: '#eff6ff' }}>
                        <span className="sidebar-icon"><SupportIcon /></span>
                        <span className="sidebar-text" style={{ color: '#1e40af', fontWeight: '700' }}>Support</span>
                        <span className="sidebar-arrow">›</span>
                    </Link>
                    <Link to="/applications" className="sidebar-nav-item" onClick={() => setIsSidebarOpen(false)} style={{ marginTop: '10px', background: '#f5f3ff', marginBottom: '30px' }}>
                        <span className="sidebar-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </span>
                        <span className="sidebar-text" style={{ color: '#5b21b6', fontWeight: '700' }}>Applications</span>
                        <span className="sidebar-arrow">›</span>
                    </Link>
                </div>
            </div>
            {
                is2FASetupOpen && user && (
                    <TwoFactorSetup user={user} onClose={() => setIs2FASetupOpen(false)} onUpdateUser={handleUserUpdate} />
                )
            }
        </header >
    )
}