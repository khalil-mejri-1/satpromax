import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import { ShopContext } from '../context/ShopContext';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://satpromax.com';

// SVG Icons (Simple placeholders)
const IconProduct = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconOrder = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const IconClient = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconHome = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconCategory = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const IconGuide = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>;

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export default function Admin() {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsManager />;
            case 'promos':
                return <PromoManager />;
            case 'orders':
                return <OrdersManager />;
            case 'clients':
                return <ClientsManager />;
            case 'home':
                return <HomeManager />;
            case 'categories':
                return <CategoryManager />;
            case 'reviews':
                return <ReviewsManager />;
            case 'details':
                return <SettingsManager />;
            case 'guides':
                return <GuidesManager />;
            case 'inquiries':
                return <GuideInquiriesManager />;
            case 'messages':
                return <ContactMessagesManager />;
            case 'support':
                return <SupportManager />;
            default:
                return <ProductsManager />;
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar / Navbar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">SATPROMAX</div>
                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <IconProduct /> Gestion de produit
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'promos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('promos')}
                    >
                        <span style={{ marginRight: '8px', fontSize: '18px' }}>🏷️</span> Gestion des Promos
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <IconOrder /> Gestion de commande
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        <IconClient /> Gestion de client
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        <IconHome /> Gestion de page home
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <IconCategory /> Gestion des Catégories
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        Gestion de commentaires
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'guides' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guides')}
                    >
                        <IconGuide /> Gestion des Guides
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        <span style={{ marginRight: '8px', fontSize: '18px' }}>❓</span> Questions Articles
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <span style={{ marginRight: '8px', fontSize: '18px' }}>💬</span> Messages Contact
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'support' ? 'active' : ''}`}
                        onClick={() => setActiveTab('support')}
                    >
                        <span style={{ marginRight: '8px', fontSize: '18px' }}>🛠️</span> Gestion de Support
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Détails Généraux
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-content">
                <div className="admin-header">
                    <div className="admin-title">
                        {activeTab === 'products' && 'Gestion de Produits'}
                        {activeTab === 'orders' && 'Gestion de Commandes'}
                        {activeTab === 'clients' && 'Gestion de Clients'}
                        {activeTab === 'home' && 'Gestion de Page Accueil'}
                        {activeTab === 'categories' && 'Gestion des Catégories'}
                        {activeTab === 'reviews' && 'Gestion de Commentaires'}
                        {activeTab === 'guides' && 'Gestion des Guides'}
                        {activeTab === 'inquiries' && 'Questions sur les Articles'}
                        {activeTab === 'messages' && 'Messages de Contact'}
                        {activeTab === 'support' && 'Gestion de Support'}
                        {activeTab === 'details' && 'Détails Généraux'}
                    </div>
                    <div className="admin-user-info">Admin User</div>
                </div>

                <div className="admin-main-view">
                    {renderContent()}
                </div>
            </main>
        </div >
    );
}

// ---------------------------------------------------------------------
// Placeholder Components for each section
// ---------------------------------------------------------------------

// Notification Component
const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification-container">
            <div className={`notification ${type}`}>
                <div className="notification-icon">
                    {type === 'success' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    )}
                </div>
                <div className="notification-content">
                    <div className="notification-title">{type === 'success' ? 'Succès' : 'Erreur'}</div>
                    <div className="notification-message">{message}</div>
                </div>
            </div>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Helper Component for Multiple Inputs (Tags/SKU)
const MultiInput = ({ items, onAdd, onRemove, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                    type="text"
                    className="form-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    style={{
                        padding: '0 15px',
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#475569'
                    }}
                >
                    +
                </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {items.map((item, index) => (
                    <span key={index} style={{
                        background: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {item}
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#94a3b8',
                                fontSize: '14px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

const PromoManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyPromos, setShowOnlyPromos] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [promoData, setPromoData] = useState({
        promoPrice: '',
        promoDurationDays: 0,
        promoDurationHours: 0,
        promoDurationMinutes: 0
    });
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchProducts = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                showNotification("Erreur de chargement des produits", "error");
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openPromoModal = (product) => {
        setCurrentProduct(product);

        let days = 0, hours = 0, minutes = 0;

        if (product.promoEndDate && product.promoStartDate) {
            const end = new Date(product.promoEndDate);
            const now = new Date();
            const diffMs = end - new Date(product.promoStartDate);
            if (diffMs > 0) {
                days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            }
        }

        setPromoData({
            promoPrice: product.promoPrice || '',
            promoDurationDays: days,
            promoDurationHours: hours,
            promoDurationMinutes: minutes
        });
        setModalOpen(true);
    };

    const handleSavePromo = async (e) => {
        e.preventDefault();

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(promoData.promoDurationDays || 0));
        endDate.setHours(endDate.getHours() + parseInt(promoData.promoDurationHours || 0));
        endDate.setMinutes(endDate.getMinutes() + parseInt(promoData.promoDurationMinutes || 0));

        const updateData = {
            promoPrice: promoData.promoPrice,
            promoStartDate: startDate,
            promoEndDate: endDate
        };

        try {
            const response = await fetch(`https://satpromax.com/api/products/${currentProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            const data = await response.json();

            if (data.success) {
                showNotification("Promo mise à jour avec succès !", "success");
                setModalOpen(false);
                fetchProducts();
            } else {
                showNotification(data.message || "Erreur", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion", "error");
        }
    };

    // Filter and Group items
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();

        if (showOnlyPromos) {
            return matchesSearch && isPromoActive;
        }
        return matchesSearch;
    });

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const category = product.category || 'Non classé';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2>Gestion des Promos</h2>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <p style={{ margin: 0, color: '#666' }}>Sélectionnez un produit pour ajouter ou modifier une promotion.</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className={`btn ${showOnlyPromos ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowOnlyPromos(!showOnlyPromos)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <span style={{ fontSize: '16px' }}>{showOnlyPromos ? '★' : '☆'}</span>
                        {showOnlyPromos ? 'Voir Tout' : 'Voir Promos Actives'}
                    </button>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ maxWidth: '300px' }}
                    />
                </div>
            </div>

            {Object.keys(groupedProducts).map(category => (
                <div key={category} style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>{category}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {groupedProducts[category].map(product => {
                            const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();
                            return (
                                <div
                                    key={product._id}
                                    onClick={() => openPromoModal(product)}
                                    style={{
                                        border: isPromoActive ? '2px solid #ef4444' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        background: '#fff',
                                        position: 'relative',
                                        transition: 'transform 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {isPromoActive && <div style={{ position: 'absolute', top: -10, right: -5, background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>PROMO ACTIVE</div>}
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                        <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                    </div>
                                    <h4 style={{ fontSize: '14px', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{product.price}</span>
                                        {isPromoActive && <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>{product.promoPrice}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Configurer Promo: ${currentProduct?.name}`}
            >
                <form onSubmit={handleSavePromo}>
                    <div className="form-group">
                        <label className="form-label">Prix Actuel</label>
                        <input type="text" className="form-input" value={currentProduct?.price || ''} disabled style={{ background: '#f1f5f9' }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Prix Promo (Nouveau prix)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={promoData.promoPrice}
                            onChange={e => setPromoData({ ...promoData, promoPrice: e.target.value })}
                            placeholder="ex: 99 DT"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Durée de la promo (à partir de maintenant)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationDays}
                                    onChange={e => setPromoData({ ...promoData, promoDurationDays: e.target.value })}
                                    min="0"
                                />
                                <span style={{ fontSize: '12px', color: '#666' }}>Jours</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationHours}
                                    onChange={e => setPromoData({ ...promoData, promoDurationHours: e.target.value })}
                                    min="0" max="23"
                                />
                                <span style={{ fontSize: '12px', color: '#666' }}>Heures</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationMinutes}
                                    onChange={e => setPromoData({ ...promoData, promoDurationMinutes: e.target.value })}
                                    min="0" max="59"
                                />
                                <span style={{ fontSize: '12px', color: '#666' }}>Minutes</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer la Promo</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const ProductsManager = () => {
    const { categories } = useContext(ShopContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'delete'
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', image: '', category: 'Streaming', description: '', skuList: [], tagsList: [],
        metaTitle: '', metaDescription: '', resolution: '', region: '', downloadLink: '', galleryList: [],
        descriptionGlobal: '', extraSections: [], hasDelivery: false, deliveryPrice: ''
    });
    const [notification, setNotification] = useState(null);



    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchProducts = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                showNotification("Erreur de chargement des produits", "error");
            });
    };

    const [settings, setSettings] = useState({ resolutions: [], regions: [] });

    useEffect(() => {
        fetchProducts();
        fetch('https://satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSettings(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handlers for MultiInput
    const addSku = (sku) => setFormData(prev => ({ ...prev, skuList: [...prev.skuList, sku] }));
    const removeSku = (index) => setFormData(prev => ({ ...prev, skuList: prev.skuList.filter((_, i) => i !== index) }));

    const addTag = (tag) => setFormData(prev => ({ ...prev, tagsList: [...prev.tagsList, tag] }));
    const removeTag = (index) => setFormData(prev => ({ ...prev, tagsList: prev.tagsList.filter((_, i) => i !== index) }));

    const openAddModal = () => {
        setModalType('add');
        setFormData({
            name: '',
            price: '',
            image: '',
            category: categories.length > 0 ? (typeof categories[0] === 'object' ? categories[0].name : categories[0]) : 'Streaming',
            description: '',
            skuList: [],
            tagsList: [],
            metaTitle: '',
            metaDescription: '',
            resolution: '',
            region: '',
            downloadLink: '',
            galleryList: [],
            descriptionGlobal: '',
            extraSections: [],
            hasDelivery: false,
            deliveryPrice: ''
        });
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalType('edit');
        setCurrentProduct(product);

        // Convert comma-separated strings to arrays
        const skuList = product.sku ? product.sku.split(',').map(s => s.trim()).filter(s => s) : [];
        const tagsList = product.tags ? product.tags.split(',').map(t => t.trim()).filter(t => t) : [];

        setFormData({
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description || '',
            skuList: skuList,
            tagsList: tagsList,
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
            resolution: product.resolution || '',
            region: product.region || '',
            downloadLink: product.downloadLink || '',
            galleryList: product.gallery || [],
            descriptionGlobal: product.descriptionGlobal || '',
            extraSections: product.extraSections || [],
            hasDelivery: product.hasDelivery || false,
            deliveryPrice: product.deliveryPrice || ''
        });
        setModalOpen(true);
    };

    const openDeleteModal = (product) => {
        setModalType('delete');
        setCurrentProduct(product);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let url = 'https://satpromax.com/api/products';
        let method = 'POST';

        if (modalType === 'edit') {
            url += `/${currentProduct._id}`;
            method = 'PUT';
        }

        // Prepare data for backend (convert arrays back to strings)
        const submissionData = {
            ...formData,
            sku: formData.skuList.join(', '),
            tags: formData.tagsList.join(', '),
            gallery: formData.galleryList.filter(url => url.trim() !== ''),
            extraSections: formData.extraSections.filter(s => s.title.trim() !== '' || s.content.trim() !== '')
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });
            const data = await response.json();

            if (data.success) {
                showNotification(modalType === 'add' ? "Produit ajouté avec succès !" : "Produit mis à jour !", "success");
                setModalOpen(false);
                fetchProducts();
            } else {
                showNotification(data.message || "Une erreur est survenue", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion au serveur", "error");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://satpromax.com/api/products/${currentProduct._id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                showNotification("Produit supprimé avec succès", "success");
                setModalOpen(false);
                fetchProducts();
            } else {
                showNotification(data.message || "Erreur lors de la suppression", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion au serveur", "error");
        }
    };

    const handleToggleStock = async (product) => {
        try {
            const response = await fetch(`https://satpromax.com/api/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: !product.inStock })
            });
            const data = await response.json();

            if (data.success) {
                showNotification(`Produit marqué comme ${!product.inStock ? 'Disponible' : 'Indisponible'}`, "success");
                fetchProducts();
            } else {
                showNotification(data.message || "Erreur lors de la mise à jour", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion au serveur", "error");
        }
    };

    // Filter and Group products
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const category = product.category || 'Non classé';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement des produits...</div>;

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2>Gestion des Produits</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Rechercher un produit (Nom, SKU)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ width: '250px' }}
                    />
                    <button className="btn btn-primary" onClick={openAddModal}>
                        + Ajouter un produit
                    </button>
                </div>
            </div>

            {Object.keys(groupedProducts).length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666', background: '#f9fafb', borderRadius: '8px' }}>
                    Aucun produit trouvé dans la base de données.
                </div>
            ) : (
                Object.keys(groupedProducts).map(category => (
                    <div key={category} style={{ marginBottom: '40px' }}>
                        <h3 style={{
                            fontSize: '18px',
                            color: '#1e293b',
                            borderBottom: '2px solid #e2e8f0',
                            paddingBottom: '10px',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            {category}
                            <span style={{
                                fontSize: '12px',
                                background: '#e2e8f0',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                color: '#64748b'
                            }}>
                                {groupedProducts[category].length}
                            </span>
                        </h3>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Image</th>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Nom</th>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Prix</th>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>SKU</th>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Tags</th>
                                        <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedProducts[category].map(product => (
                                        <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="product-row">
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: '500', color: '#334155' }}>{product.name}</td>
                                            <td style={{ padding: '12px', fontWeight: '600', color: '#16a34a' }}>{product.price}</td>
                                            <td style={{ padding: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{product.sku || '-'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {product.tags ? product.tags.split(',').slice(0, 2).map((tag, i) => (
                                                        <span key={i} style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>{tag.trim()}</span>
                                                    )) : '-'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    style={{
                                                        marginRight: '8px',
                                                        padding: '6px 12px',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '6px',
                                                        background: '#fff',
                                                        color: '#475569',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStock(product)}
                                                    style={{
                                                        marginRight: '8px',
                                                        padding: '6px 12px',
                                                        border: `1px solid ${product.inStock !== false ? '#86efac' : '#fca5a5'}`,
                                                        borderRadius: '6px',
                                                        background: product.inStock !== false ? '#dcfce7' : '#fee2e2',
                                                        color: product.inStock !== false ? '#166534' : '#ef4444',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        minWidth: '80px'
                                                    }}
                                                >
                                                    {product.inStock !== false ? 'Disponible' : 'Épuisé'}
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(product)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        border: '1px solid #fca5a5',
                                                        borderRadius: '6px',
                                                        background: '#fee2e2',
                                                        color: '#ef4444',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Suppr.
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}

            {/* Modal for Add/Edit */}
            <Modal
                isOpen={modalOpen && (modalType === 'add' || modalType === 'edit')}
                onClose={() => setModalOpen(false)}
                title={modalType === 'add' ? 'Ajouter un Produit' : 'Modifier le Produit'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nom du produit</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Prix (ex: 12 DT)</label>
                            <input type="text" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Catégorie</label>
                            <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
                                {categories.map(cat => {
                                    const name = typeof cat === 'object' ? cat.name : cat;
                                    return <option key={name} value={name}>{name}</option>;
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: formData.hasDelivery ? '15px' : '0' }}>
                            <input
                                type="checkbox"
                                id="hasDelivery"
                                checked={formData.hasDelivery}
                                onChange={(e) => setFormData({ ...formData, hasDelivery: e.target.checked })}
                                style={{ width: '18px', height: '18px', marginRight: '10px', cursor: 'pointer' }}
                            />
                            <label htmlFor="hasDelivery" style={{ cursor: 'pointer', fontWeight: '600', color: '#334155' }}>Ce produit a une livraison payante ?</label>
                        </div>

                        {formData.hasDelivery && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Prix de Livraison</label>
                                <input
                                    type="text"
                                    name="deliveryPrice"
                                    className="form-input"
                                    value={formData.deliveryPrice}
                                    onChange={handleInputChange}
                                    placeholder="ex: 7 DT"
                                />
                            </div>
                        )}
                    </div>

                    {(formData.category === 'IPTV Premium' || formData.category === 'Abonnement IPTV') && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label className="form-label">Résolution</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxHeight: '200px', overflowY: 'auto', padding: '5px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                        {settings.resolutions && settings.resolutions.length > 0 ? settings.resolutions.map(res => (
                                            <div
                                                key={res.name}
                                                onClick={() => setFormData({ ...formData, resolution: res.name })}
                                                style={{
                                                    border: formData.resolution === res.name ? '2px solid #fbbf24' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    background: formData.resolution === res.name ? '#fffbeb' : '#fff',
                                                    textAlign: 'center',
                                                    width: '90px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
                                                    {res.image ? (
                                                        <img src={res.image} alt={res.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '20px' }}>📺</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>{res.name}</div>
                                            </div>
                                        )) : <p style={{ fontSize: '12px', color: '#999', padding: '10px' }}>Aucune résolution configurée (Allez dans Détails Généraux)</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Région</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxHeight: '200px', overflowY: 'auto', padding: '5px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                        {settings.regions && settings.regions.length > 0 ? settings.regions.map(reg => (
                                            <div
                                                key={reg.name}
                                                onClick={() => setFormData({ ...formData, region: reg.name })}
                                                style={{
                                                    border: formData.region === reg.name ? '2px solid #10b981' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    background: formData.region === reg.name ? '#ecfdf5' : '#fff',
                                                    textAlign: 'center',
                                                    width: '90px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
                                                    {reg.image ? (
                                                        <img src={reg.image} alt={reg.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '20px' }}>🌍</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>{reg.name}</div>
                                            </div>
                                        )) : <p style={{ fontSize: '12px', color: '#999', padding: '10px' }}>Aucune région configurée (Allez dans Détails Généraux)</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Link Telechargement (URL)</label>
                                <input type="text" name="downloadLink" className="form-input" value={formData.downloadLink} onChange={handleInputChange} placeholder="https://..." />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ color: '#1e293b', fontWeight: 'bold' }}>Meta Title (SEO)</label>
                            <input type="text" name="metaTitle" className="form-input" value={formData.metaTitle} onChange={handleInputChange} placeholder="Titre pour Google" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ color: '#1e293b', fontWeight: 'bold' }}>Meta Description (SEO)</label>
                            <input type="text" name="metaDescription" className="form-input" value={formData.metaDescription} onChange={handleInputChange} placeholder="Description pour Google" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL Principale</label>
                        <input type="text" name="image" className="form-input" value={formData.image} onChange={handleInputChange} required />

                        <div style={{ marginTop: '10px' }}>
                            <label className="form-label" style={{ fontSize: '13px', color: '#64748b' }}>Galerie d'images (Sub-images)</label>
                            {formData.galleryList.map((url, index) => (
                                <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={url}
                                        onChange={(e) => {
                                            const newList = [...formData.galleryList];
                                            newList[index] = e.target.value;
                                            setFormData({ ...formData, galleryList: newList });
                                        }}
                                        placeholder="URL Image secondaire"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newList = formData.galleryList.filter((_, i) => i !== index);
                                            setFormData({ ...formData, galleryList: newList });
                                        }}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', padding: '0 10px', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, galleryList: [...formData.galleryList, ''] })}
                                className="btn btn-secondary"
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                                + Ajouter une image secondaire
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" value={formData.description} onChange={handleInputChange}></textarea>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">SKU</label>
                            <MultiInput
                                items={formData.skuList}
                                onAdd={addSku}
                                onRemove={removeSku}
                                placeholder="Ajouter SKU + Entrée"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <MultiInput
                                items={formData.tagsList}
                                onAdd={addTag}
                                onRemove={removeTag}
                                placeholder="Ajouter Tag + Entrée"
                            />
                        </div>
                    </div>

                    <div style={{ padding: '20px', background: '#fff', border: '2px solid #fbbf24', borderRadius: '15px', marginBottom: '20px', marginTop: '20px' }}>
                        <h4 style={{ marginBottom: '15px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            Description Longue (Design Premium)
                        </h4>

                        <div className="form-group">
                            <label className="form-label">Description Globale (Paragraphe d'introduction)</label>
                            <textarea
                                name="descriptionGlobal"
                                className="form-input"
                                style={{ minHeight: '100px', resize: 'vertical' }}
                                value={formData.descriptionGlobal}
                                onChange={handleInputChange}
                                placeholder="Découvrez une nouvelle façon de vivre le divertissement..."
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Sections Supplémentaires</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        extraSections: [...prev.extraSections, { title: '', content: '' }]
                                    }))}
                                    style={{
                                        background: '#fbbf24',
                                        border: 'none',
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Ajouter une section
                                </button>
                            </div>

                            {formData.extraSections.map((section, idx) => (
                                <div key={idx} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            extraSections: prev.extraSections.filter((_, i) => i !== idx)
                                        }))}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        &times;
                                    </button>

                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '12px' }}>Titre de la section</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={section.title}
                                            onChange={(e) => {
                                                const newSections = [...formData.extraSections];
                                                newSections[idx].title = e.target.value;
                                                setFormData(prev => ({ ...prev, extraSections: newSections }));
                                            }}
                                            placeholder="Pourquoi choisir ALPHA IPTV ?"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '12px' }}>Contenu (Utilisez Entrée pour séparer les points)</label>
                                        <textarea
                                            className="form-input"
                                            style={{ minHeight: '80px', resize: 'vertical' }}
                                            value={section.content}
                                            onChange={(e) => {
                                                const newSections = [...formData.extraSections];
                                                newSections[idx].content = e.target.value;
                                                setFormData(prev => ({ ...prev, extraSections: newSections }));
                                            }}
                                            placeholder="Accédez à +15 000 chaînes..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">{modalType === 'add' ? 'Ajouter' : 'Enregistrer'}</button>
                    </div>
                </form>
            </Modal>

            {/* Modal for Delete */}
            <Modal
                isOpen={modalOpen && modalType === 'delete'}
                onClose={() => setModalOpen(false)}
                title="Confirmer la suppression"
            >
                <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{currentProduct?.name}</strong> ?</p>
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>Cette action est irréversible.</p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
                </div>
            </Modal>
        </div>
    );
};

const OrdersManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusModal, setStatusModal] = useState({ open: false, orderId: null, currentStatus: '' });
    const [deleteModal, setDeleteModal] = useState({ open: false, type: 'single', targetId: null });

    const fetchOrders = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirmDelete = async () => {
        try {
            const url = deleteModal.type === 'all'
                ? 'https://satpromax.com/api/orders'
                : `https://satpromax.com/api/orders/${deleteModal.targetId}`;

            const response = await fetch(url, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                setDeleteModal({ open: false, type: 'single', targetId: null });
                fetchOrders();
            } else {
                alert("Erreur: " + data.message);
            }
        } catch (error) {
            console.error("Error during deletion:", error);
            alert("Erreur lors de la suppression");
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const response = await fetch(`https://satpromax.com/api/orders/${statusModal.orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();

            if (data.success) {
                setStatusModal({ open: false, orderId: null, currentStatus: '' });
                fetchOrders(); // Refresh list
            } else {
                alert("Erreur: " + data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Erreur lors de la mise à jour du statut");
        }
    };


    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        const clientName = (order.userValidation?.name || order.userId?.username || 'Client').toLowerCase();
        const contact = (order.userValidation?.whatsapp || '').toLowerCase();
        const status = order.status.toLowerCase();
        const id = order._id.toLowerCase();
        // Check items as well
        const itemsMatch = order.items.some(item => item.name.toLowerCase().includes(term));

        return clientName.includes(term) || contact.includes(term) || status.includes(term) || id.includes(term) || itemsMatch;
    });

    if (loading) return <div>Chargement des commandes...</div>;

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2>Gestion de Commandes</h2>
                    <p className="text-muted">Suivez et traitez les commandes des clients.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Rechercher (Client, Tel, Statut)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ width: '250px' }}
                    />
                    {orders.length > 0 && (
                        <button
                            onClick={() => setDeleteModal({ open: true, type: 'all', targetId: null })}
                            style={{
                                padding: '8px 16px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                                height: '42px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            🗑️ Tout supprimer
                        </button>
                    )}
                </div>
            </div>
            <br />

            {/* Custom Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, type: 'single', targetId: null })}
                title="Confirmation de suppression"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#fee2e2',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '30px'
                    }}>
                        ⚠️
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>
                        {deleteModal.type === 'all' ? 'Supprimer toutes les commandes ?' : 'Supprimer cette commande ?'}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }}>
                        {deleteModal.type === 'all'
                            ? 'Cette action supprimera définitivement toutes les commandes de la base de données. Vous ne pourrez pas revenir en arrière.'
                            : 'Voulez-vous vraiment supprimer définitivement cette commande ? Cette opération est irréversible.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => setDeleteModal({ open: false, type: 'single', targetId: null })}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: '#fff',
                                color: '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#dc2626',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Oui, supprimer
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Status Edit Modal */}
            <Modal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ open: false, orderId: null, currentStatus: '' })}
                title="Mettre à jour le statut"
            >
                <div>
                    <p style={{ marginBottom: '15px' }}>Sélectionnez le nouveau statut pour cette commande :</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {['En attente', 'Confirmé', 'Expédié', 'Livré', 'Annulé'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: status === statusModal.currentStatus ? '#e0f2fe' : '#fff',
                                    color: status === statusModal.currentStatus ? '#0284c7' : '#334155',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>


            {filteredOrders.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f9fafb', borderRadius: '8px' }}>
                    {orders.length === 0 ? 'Aucune commande trouvée.' : 'Aucune commande ne correspond à votre recherche.'}
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Produits</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Appareil</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Client</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Contact</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Total</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Paiement</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Statut</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff' }} />
                                                    <div>
                                                        <div style={{ fontWeight: '500', fontSize: '13px', color: '#1e293b' }}>{item.name}</div>
                                                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                            Qté: {item.quantity} | {item.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.deviceChoice && (
                                                        <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block', marginBottom: '2px' }}>
                                                            {item.deviceChoice}
                                                        </span>
                                                    )}
                                                    {item.receiverSerial && (
                                                        <span style={{ color: '#7e22ce', background: '#f3e8ff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' }}>
                                                            S/N: {item.receiverSerial}
                                                        </span>
                                                    )}
                                                    {!item.deviceChoice && !item.receiverSerial && <span style={{ color: '#94a3b8', fontSize: '11px' }}>-</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>
                                        {order.userValidation?.name || order.userId?.username || 'Client'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontSize: '12px' }}>
                                            <a
                                                href={`https://wa.me/${(order.userValidation?.whatsapp || '').replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: '#25D366',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                {order.userValidation?.whatsapp}
                                            </a>
                                            <div style={{ color: '#64748b' }}>{order.userValidation?.address}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#16a34a' }}>{order.totalAmount} DT</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            textTransform: 'uppercase',
                                            whiteSpace: 'nowrap',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {order.paymentMethod || 'COD'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            background: order.status === 'Livré' ? '#dcfce7' : '#fff7ed',
                                            color: order.status === 'Livré' ? '#166534' : '#9a3412',
                                            textTransform: 'uppercase',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => setStatusModal({ open: true, orderId: order._id, currentStatus: order.status })}
                                                style={{
                                                    padding: '6px 12px',
                                                    fontSize: '12px',
                                                    background: '#eff6ff',
                                                    border: '1px solid #bfdbfe',
                                                    color: '#1d4ed8',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Statut
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, type: 'single', targetId: order._id })}
                                                style={{
                                                    padding: '6px 10px',
                                                    fontSize: '12px',
                                                    background: '#fff',
                                                    border: '1px solid #fecaca',
                                                    color: '#dc2626',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                                title="Supprimer la commande"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ClientsManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/users')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUsers(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [confirmModal, setConfirmModal] = useState({ open: false, user: null });
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const confirmToggleRole = (user) => {
        setConfirmModal({ open: true, user });
    };

    const handleRoleUpdate = async () => {
        const user = confirmModal.user;
        const newRole = user.role === 'admin' ? 'client' : 'admin';

        try {
            const response = await fetch(`https://satpromax.com/api/users/${user._id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
                showNotification(`Rôle de ${user.username} mis à jour avec succès`, 'success');
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification("Erreur serveur", 'error');
        } finally {
            setConfirmModal({ open: false, user: null });
        }
    };

    if (loading) return <div>Chargement des clients...</div>;

    return (
        <div className="admin-card">
            <h2>Base Clients</h2>
            <p className="text-muted">Visualisez et gérez les comptes clients.</p>
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    background: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: notification.type === 'success' ? '#166534' : '#991b1b',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 2000,
                    fontWeight: '600',
                    animation: 'slideIn 0.3s ease'
                }}>
                    {notification.message}
                </div>
            )}

            {/* Custom Confirmation Modal */}
            <Modal
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, user: null })}
                title="Confirmer le changement de rôle"
            >
                <div>
                    <p style={{ fontSize: '16px', color: '#334155', marginBottom: '20px', lineHeight: '1.5' }}>
                        Voulez-vous vraiment passer <strong>{confirmModal.user?.username}</strong> en
                        <span style={{
                            fontWeight: 'bold',
                            color: confirmModal.user?.role === 'admin' ? '#1e40af' : '#dc2626',
                            marginLeft: '5px'
                        }}>
                            {confirmModal.user?.role === 'admin' ? 'client' : 'admin'}
                        </span> ?
                    </p>

                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={() => setConfirmModal({ open: false, user: null })}>
                            Annuler
                        </button>
                        <button className="btn btn-primary" onClick={handleRoleUpdate}>
                            Confirmer
                        </button>
                    </div>
                </div>
            </Modal>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Utilisateur</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Date d'inscription</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Rôle</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user.role === 'admin' ? '#ef4444' : '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    {user.username}
                                </td>
                                <td style={{ padding: '12px', color: '#64748b' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        background: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                                        color: user.role === 'admin' ? '#991b1b' : '#1e40af'
                                    }}>
                                        {user.role || 'client'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => confirmToggleRole(user)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0',
                                            background: 'white',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            color: '#475569'
                                        }}
                                    >
                                        Changer Rôle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const HomeManager = () => {
    const [topStripText, setTopStripText] = useState('');
    const [topStripMessage, setTopStripMessage] = useState('');

    // Hero Data
    const [heroData, setHeroData] = useState({
        heroMainImages: [],
        heroCardBoxImages: [],
        heroCardBoxImage: '',
        heroCardBoxTitle: '',
        heroCardBoxLink: '',
        heroCardNetflixImage: '',
        heroCardNetflixTitle: '',
        heroCardNetflixLink: '',
        heroCardGiftImage: '',
        heroCardGiftTitle: '',
        heroCardGiftLink: '',
        heroCardSoftImage: '',
        heroCardSoftTitle: '',
        heroCardSoftLink: '',
        promoCards: []
    });

    // Footer Data
    const [footerData, setFooterData] = useState({
        footerDescription: '',
        footerContactPhone: '',
        facebookUrl: '',
        telegramUrl: '',
        socialLinks: [],
        footerColumn1: { title: 'IPTV Premium', links: [] },
        footerColumn2: { title: 'Streaming', links: [] },
        footerColumn3: { title: 'Cartes Cadeaux', links: [] }
    });

    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    useEffect(() => {
        fetch('https://satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setTopStripText(data.data.topStripText || '');
                    setTopStripMessage(data.data.topStripMessage || '');
                    setHeroData({
                        heroMainImages: data.data.heroMainImages || [],
                        heroCardBoxImages: data.data.heroCardBoxImages || [],
                        heroCardBoxImage: data.data.heroCardBoxImage || '',
                        heroCardBoxTitle: data.data.heroCardBoxTitle || '',
                        heroCardBoxLink: data.data.heroCardBoxLink || '',
                        heroCardNetflixImage: data.data.heroCardNetflixImage || '',
                        heroCardNetflixTitle: data.data.heroCardNetflixTitle || '',
                        heroCardNetflixLink: data.data.heroCardNetflixLink || '',
                        heroCardGiftImage: data.data.heroCardGiftImage || '',
                        heroCardGiftTitle: data.data.heroCardGiftTitle || '',
                        heroCardGiftLink: data.data.heroCardGiftLink || '',
                        heroCardSoftImage: data.data.heroCardSoftImage || '',
                        heroCardSoftTitle: data.data.heroCardSoftTitle || '',
                        heroCardSoftLink: data.data.heroCardSoftLink || '',
                        promoCards: data.data.promoCards || []
                    });
                    setFooterData({
                        footerDescription: data.data.footerDescription || '',
                        footerContactPhone: data.data.footerContactPhone || '',
                        facebookUrl: data.data.facebookUrl || '',
                        telegramUrl: data.data.telegramUrl || '',
                        socialLinks: data.data.socialLinks || [],
                        footerColumn1: data.data.footerColumn1 || { title: 'IPTV Premium', links: [] },
                        footerColumn2: data.data.footerColumn2 || { title: 'Streaming', links: [] },
                        footerColumn3: data.data.footerColumn3 || { title: 'Cartes Cadeaux', links: [] }
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        try {
            const body = {
                topStripText,
                topStripMessage,
                ...heroData,
                ...footerData
            };

            const response = await fetch('https://satpromax.com/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.success) {
                showNotification("Page d'accueil et Footer mis à jour !", "success");
            } else {
                showNotification("Erreur lors de la mise à jour", "error");
            }
        } catch (error) {
            showNotification("Erreur de connexion", "error");
        }
    };

    // Helper for MultiInput state updates
    const addImage = (field, url) => {
        setHeroData(prev => ({ ...prev, [field]: [...prev[field], url] }));
    };
    const removeImage = (field, index) => {
        setHeroData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const updatePromoCard = (index, field, value) => {
        const newCards = [...heroData.promoCards];
        // If card doesn't exist at index, initialize it
        if (!newCards[index]) newCards[index] = { title: '', image: '', link: '' };
        newCards[index][field] = value;
        setHeroData(prev => ({ ...prev, promoCards: newCards }));
    };

    const addPromoCard = () => {
        setHeroData(prev => ({ ...prev, promoCards: [...prev.promoCards, { title: 'Nouveau', image: '', link: '' }] }));
    };

    const removePromoCard = (index) => {
        setHeroData(prev => ({ ...prev, promoCards: prev.promoCards.filter((_, i) => i !== index) }));
    };

    // Helper for Footer Links
    const updateFooterCol = (colName, key, value) => {
        setFooterData(prev => ({
            ...prev,
            [colName]: { ...prev[colName], [key]: value }
        }));
    };

    const addFooterLink = (colName, link) => {
        setFooterData(prev => ({
            ...prev,
            [colName]: { ...prev[colName], links: [...prev[colName].links, link] }
        }));
    };

    const removeFooterLink = (colName, index) => {
        setFooterData(prev => ({
            ...prev,
            [colName]: { ...prev[colName], links: prev[colName].links.filter((_, i) => i !== index) }
        }));
    };

    const addSocialLink = () => {
        setFooterData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { name: '', icon: '', url: '' }]
        }));
    };

    const updateSocialLink = (index, field, value) => {
        const newLinks = [...footerData.socialLinks];
        newLinks[index][field] = value;
        setFooterData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const removeSocialLink = (index) => {
        const newLinks = footerData.socialLinks.filter((_, i) => i !== index);
        setFooterData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2>Gestion de la Page d'Accueil</h2>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }}>Barre Supérieure (Top Strip)</h3>
                <div className="form-group">
                    <label className="form-label">Contact (Gauche)</label>
                    <input type="text" className="form-input" value={topStripText} onChange={(e) => setTopStripText(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Message Promo (Droite)</label>
                    <input type="text" className="form-input" value={topStripMessage} onChange={(e) => setTopStripMessage(e.target.value)} />
                </div>
            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }}>Bannière Principale (Slider)</h3>
                <div className="form-group">
                    <label className="form-label">Images du Slider Principal (Ajoutez plusieurs URLs)</label>
                    <MultiInput
                        items={heroData.heroMainImages}
                        onAdd={(val) => addImage('heroMainImages', val)}
                        onRemove={(idx) => removeImage('heroMainImages', idx)}
                        placeholder="https://... + Entrée"
                    />
                </div>
            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }}>Cartes Secondaires</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label className="form-label">Carte 1 (ex: Box Android)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="URL Image"
                            value={heroData.heroCardBoxImage}
                            onChange={(e) => setHeroData({ ...heroData, heroCardBoxImage: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardBoxTitle} onChange={e => setHeroData({ ...heroData, heroCardBoxTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardBoxLink} onChange={e => setHeroData({ ...heroData, heroCardBoxLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label className="form-label">Carte 2 (ex: Netflix)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="URL Image"
                            value={heroData.heroCardNetflixImage}
                            onChange={(e) => setHeroData({ ...heroData, heroCardNetflixImage: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardNetflixTitle} onChange={e => setHeroData({ ...heroData, heroCardNetflixTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardNetflixLink} onChange={e => setHeroData({ ...heroData, heroCardNetflixLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label className="form-label">Carte 3 (ex: Gift Cards)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="URL Image"
                            value={heroData.heroCardGiftImage}
                            onChange={(e) => setHeroData({ ...heroData, heroCardGiftImage: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardGiftTitle} onChange={e => setHeroData({ ...heroData, heroCardGiftTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardGiftLink} onChange={e => setHeroData({ ...heroData, heroCardGiftLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label className="form-label">Carte 4 (ex: Software)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="URL Image"
                            value={heroData.heroCardSoftImage}
                            onChange={(e) => setHeroData({ ...heroData, heroCardSoftImage: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardSoftTitle} onChange={e => setHeroData({ ...heroData, heroCardSoftTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardSoftLink} onChange={e => setHeroData({ ...heroData, heroCardSoftLink: e.target.value })} />
                    </div>
                </div>

            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }}>Cartes Promo (Section "Abonnements")</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Ces 3 cartes s'affichent sous le slider principal. Cliquez sur "+" pour en ajouter si nécessaire.</p>

                {heroData.promoCards && heroData.promoCards.map((card, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h4 style={{ fontSize: '14px', margin: 0 }}>Carte #{index + 1}</h4>
                            <button onClick={() => removePromoCard(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Supprimer</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Titre (ex: Abonnement Sharing)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={card.title || ''}
                                    onChange={(e) => updatePromoCard(index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={card.image || ''}
                                    onChange={(e) => updatePromoCard(index, 'image', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addPromoCard}
                    className="btn btn-secondary"
                    style={{ fontSize: '13px' }}
                >
                    + Ajouter une carte
                </button>
            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }}>Pied de page (Footer)</h3>
                <div className="form-group">
                    <label className="form-label">Description (À Propos)</label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '80px', resize: 'vertical' }}
                        value={footerData.footerDescription}
                        onChange={(e) => setFooterData({ ...footerData, footerDescription: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Numéro de Contact</label>
                    <input
                        type="text"
                        className="form-input"
                        value={footerData.footerContactPhone}
                        onChange={(e) => setFooterData({ ...footerData, footerContactPhone: e.target.value })}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Lien Facebook</label>
                        <input
                            type="text"
                            className="form-input"
                            value={footerData.facebookUrl}
                            onChange={(e) => setFooterData({ ...footerData, facebookUrl: e.target.value })}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Lien Telegram</label>
                        <input
                            type="text"
                            className="form-input"
                            value={footerData.telegramUrl}
                            onChange={(e) => setFooterData({ ...footerData, telegramUrl: e.target.value })}
                            placeholder="https://t.me/..."
                        />
                    </div>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#854d0e' }}>Réseaux Sociaux Dynamiques (Icônes supplémentaires)</h4>
                    {footerData.socialLinks && footerData.socialLinks.map((link, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nom (ex: Instagram)"
                                value={link.name}
                                onChange={(e) => updateSocialLink(idx, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL Icône"
                                value={link.icon}
                                onChange={(e) => updateSocialLink(idx, 'icon', e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Lien (URL)"
                                value={link.url}
                                onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                            />
                            <button
                                onClick={() => removeSocialLink(idx)}
                                style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addSocialLink}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px', marginTop: '5px' }}
                    >
                        + Ajouter un réseau social
                    </button>
                </div>

                <h4 style={{ fontSize: '14px', marginTop: '20px', marginBottom: '10px', color: '#64748b' }}>Colonnes de Liens</h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {/* Column 1 */}
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div className="form-group">
                            <label className="form-label">Titre Colonne 1</label>
                            <input
                                type="text"
                                className="form-input"
                                value={footerData.footerColumn1.title}
                                onChange={(e) => updateFooterCol('footerColumn1', 'title', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Liens Colonne 1</label>
                            <MultiInput
                                items={footerData.footerColumn1.links}
                                onAdd={(val) => addFooterLink('footerColumn1', val)}
                                onRemove={(idx) => removeFooterLink('footerColumn1', idx)}
                                placeholder="Nom du lien + Entrée"
                            />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div className="form-group">
                            <label className="form-label">Titre Colonne 2</label>
                            <input
                                type="text"
                                className="form-input"
                                value={footerData.footerColumn2.title}
                                onChange={(e) => updateFooterCol('footerColumn2', 'title', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Liens Colonne 2</label>
                            <MultiInput
                                items={footerData.footerColumn2.links}
                                onAdd={(val) => addFooterLink('footerColumn2', val)}
                                onRemove={(idx) => removeFooterLink('footerColumn2', idx)}
                                placeholder="Nom du lien + Entrée"
                            />
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div className="form-group">
                            <label className="form-label">Titre Colonne 3</label>
                            <input
                                type="text"
                                className="form-input"
                                value={footerData.footerColumn3.title}
                                onChange={(e) => updateFooterCol('footerColumn3', 'title', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Liens Colonne 3</label>
                            <MultiInput
                                items={footerData.footerColumn3.links}
                                onAdd={(val) => addFooterLink('footerColumn3', val)}
                                onRemove={(idx) => removeFooterLink('footerColumn3', idx)}
                                placeholder="Nom du lien + Entrée"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '16px' }} onClick={handleSave}>Enregistrer Tout</button>
        </div >
    );
};

const CategoryManager = () => {
    const { fetchCategories } = useContext(ShopContext);
    const [settings, setSettings] = useState({ categories: [] });
    const [newCategory, setNewCategory] = useState({ name: '', icon: '', title: '', description: '', slug: '', metaTitle: '', metaDescription: '', keywords: '' });
    const [editCategoryModal, setEditCategoryModal] = useState({
        isOpen: false,
        oldName: '',
        newName: '',
        newIcon: '',
        newTitle: '',
        newDescription: '',
        newSlug: '',
        newMetaTitle: '',
        newMetaDescription: '',
        newKeywords: ''
    });
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchSettings = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSettings(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            const response = await fetch('https://satpromax.com/api/settings/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewCategory({ name: '', icon: '', title: '', description: '', slug: '', metaTitle: '', metaDescription: '', keywords: '' });
                fetchCategories();
                showNotification("Catégorie ajoutée", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        try {
            const response = await fetch(`https://satpromax.com/api/settings/categories/${encodeURIComponent(categoryName)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                fetchCategories();
                showNotification("Catégorie supprimée", "success");
                setConfirmModal({ isOpen: false, item: null });
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleUpdateCategory = async () => {
        const { oldName, newName, newIcon, newTitle, newDescription, newSlug, newMetaTitle, newMetaDescription, newKeywords } = editCategoryModal;
        if (!newName.trim()) return;

        try {
            const response = await fetch(`https://satpromax.com/api/settings/categories/${encodeURIComponent(oldName)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newCategory: newName.trim(),
                    newIcon: newIcon.trim(),
                    newTitle: newTitle.trim(),
                    newDescription: newDescription.trim(),
                    newSlug: newSlug.trim(),
                    newMetaTitle: newMetaTitle.trim(),
                    newMetaDescription: newMetaDescription.trim(),
                    newKeywords: newKeywords.trim()
                })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setEditCategoryModal({ ...editCategoryModal, isOpen: false });
                fetchCategories();
                showNotification("Catégorie mise à jour", "success");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-card">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {confirmModal.isOpen && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3>Confirmation</h3>
                        <p>Supprimer <strong>{confirmModal.item}</strong> ?</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setConfirmModal({ isOpen: false, item: null })}>Annuler</button>
                            <button className="btn" style={{ flex: 1, background: '#ef4444', color: '#fff' }} onClick={() => handleDeleteCategory(confirmModal.item)}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            {editCategoryModal.isOpen && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h3>Modifier Catégorie</h3>
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input
                                className="form-input"
                                value={editCategoryModal.newName}
                                onChange={e => {
                                    const name = e.target.value;
                                    setEditCategoryModal(prev => ({
                                        ...prev,
                                        newName: name,
                                        newSlug: slugify(name)
                                    }));
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug (URL)</label>
                            <input className="form-input" value={editCategoryModal.newSlug} onChange={e => setEditCategoryModal({ ...editCategoryModal, newSlug: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Icône (Emoji أو URL صورة)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input className="form-input" value={editCategoryModal.newIcon} onChange={e => setEditCategoryModal({ ...editCategoryModal, newIcon: e.target.value })} placeholder="🔥 أو https://..." />
                                <div style={{ width: '42px', height: '42px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                    {editCategoryModal.newIcon && (editCategoryModal.newIcon.startsWith('http') || editCategoryModal.newIcon.startsWith('/') || editCategoryModal.newIcon.includes('.')) ? (
                                        <img src={editCategoryModal.newIcon} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '20px' }}>{editCategoryModal.newIcon || '📁'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Titre (Page Catégorie)</label>
                            <input className="form-input" value={editCategoryModal.newTitle} onChange={e => setEditCategoryModal({ ...editCategoryModal, newTitle: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description (Page Catégorie)</label>
                            <textarea className="form-input" style={{ height: '80px' }} value={editCategoryModal.newDescription} onChange={e => setEditCategoryModal({ ...editCategoryModal, newDescription: e.target.value })} />
                        </div>
                        <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', marginTop: '10px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b', fontWeight: '800' }}>PARAMÈTRES SEO</h4>
                            <div className="form-group">
                                <label className="form-label">Meta Nom</label>
                                <input className="form-input" value={editCategoryModal.newMetaTitle} onChange={e => setEditCategoryModal({ ...editCategoryModal, newMetaTitle: e.target.value })} placeholder="Titre pour Google" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Meta Description</label>
                                <textarea className="form-input" style={{ height: '60px' }} value={editCategoryModal.newMetaDescription} onChange={e => setEditCategoryModal({ ...editCategoryModal, newMetaDescription: e.target.value })} placeholder="Description pour Google" />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Mot Clé</label>
                                <input className="form-input" value={editCategoryModal.newKeywords} onChange={e => setEditCategoryModal({ ...editCategoryModal, newKeywords: e.target.value })} placeholder="Ex: iptv, streaming, abonnement..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn" onClick={() => setEditCategoryModal({ ...editCategoryModal, isOpen: false })}>Annuler</button>
                            <button className="btn btn-primary" onClick={handleUpdateCategory}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Gestion des Catégories</h2>

            <form onSubmit={handleAddCategory} className="form-inline" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', marginBottom: '15px' }}>
                    <input
                        className="form-input"
                        placeholder="Nom de catégorie"
                        value={newCategory.name}
                        onChange={e => {
                            const name = e.target.value;
                            setNewCategory(prev => ({
                                ...prev,
                                name,
                                slug: slugify(name)
                            }));
                        }}
                    />
                    <input
                        className="form-input"
                        placeholder="Slug (ex: streaming)"
                        value={newCategory.slug}
                        onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input className="form-input" placeholder="Icône (Emoji/URL)" value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                        <div style={{ width: '42px', height: '42px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                            {newCategory.icon && (newCategory.icon.startsWith('http') || newCategory.icon.startsWith('/') || newCategory.icon.includes('.')) ? (
                                <img src={newCategory.icon} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '20px' }}>{newCategory.icon || '📁'}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', marginBottom: '15px' }}>
                    <input className="form-input" placeholder="Titre SEO (Page)" value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} />
                    <input className="form-input" placeholder="Description courte (Page)" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr auto', gap: '15px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <input className="form-input" placeholder="Meta Nom SEO" value={newCategory.metaTitle} onChange={e => setNewCategory({ ...newCategory, metaTitle: e.target.value })} />
                    <input className="form-input" placeholder="Meta Description SEO" value={newCategory.metaDescription} onChange={e => setNewCategory({ ...newCategory, metaDescription: e.target.value })} />
                    <input className="form-input" placeholder="Mot Clé SEO" value={newCategory.keywords} onChange={e => setNewCategory({ ...newCategory, keywords: e.target.value })} />
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </div>
            </form>

            <div style={{ display: 'grid', gap: '15px' }}>
                {settings.categories && settings.categories.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/') || cat.icon.includes('.')) ? (
                                    <img src={cat.icon} alt={cat.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ fontSize: '20px' }}>{cat.icon || '📁'}</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{cat.name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Slug: {cat.slug} | {cat.title}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setEditCategoryModal({
                                isOpen: true,
                                oldName: cat.name,
                                newName: cat.name,
                                newIcon: cat.icon || '',
                                newTitle: cat.title || '',
                                newDescription: cat.description || '',
                                newSlug: cat.slug || '',
                                newMetaTitle: cat.metaTitle || '',
                                newMetaDescription: cat.metaDescription || '',
                                newKeywords: cat.keywords || ''
                            })}>Modifier</button>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444' }} onClick={() => setConfirmModal({ isOpen: true, item: cat.name })}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsManager = () => {
    const { fetchCategories } = useContext(ShopContext);
    const [settings, setSettings] = useState({ paymentModes: [], deviceChoices: [], categories: [], resolutions: [], regions: [] });
    const [newMode, setNewMode] = useState({ name: '', logo: '' });
    const [newChoice, setNewChoice] = useState('');
    const [newResolution, setNewResolution] = useState({ name: '', image: '' });
    const [newRegion, setNewRegion] = useState({ name: '', image: '' });

    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null, type: '' });

    const openConfirmModal = (item, type) => {
        setConfirmModal({ isOpen: true, item, type });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, item: null, type: '' });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchSettings = () => {
        setLoading(true);
        fetch('https://satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSettings(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddMode = async (e) => {
        e.preventDefault();
        if (!newMode.name.trim()) return;

        try {
            const response = await fetch('https://satpromax.com/api/settings/payment-modes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newMode.name.trim(), logo: newMode.logo.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewMode({ name: '', logo: '' });
                showNotification("Mode de paiement ajouté avec succès", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteMode = async (mode) => {
        try {
            const response = await fetch(`https://satpromax.com/api/settings/payment-modes/${encodeURIComponent(mode)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Mode de paiement supprimé", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleAddChoice = async (e) => {
        e.preventDefault();
        if (!newChoice.trim()) return;

        try {
            const response = await fetch('https://satpromax.com/api/settings/device-choices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ choice: newChoice.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewChoice('');
                showNotification("Choix ajouté avec succès", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteChoice = async (choice) => {
        try {
            const response = await fetch(`https://satpromax.com/api/settings/device-choices/${encodeURIComponent(choice)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Choix supprimé", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleAddResolution = async (e) => {
        e.preventDefault();
        if (!newResolution.name.trim()) return;
        try {
            const response = await fetch('https://satpromax.com/api/settings/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newResolution.name.trim(), image: newResolution.image.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewResolution({ name: '', image: '' });
                showNotification("Résolution ajoutée", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteResolution = async (name) => {
        try {
            const response = await fetch(`https://satpromax.com/api/settings/resolutions/${encodeURIComponent(name)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Résolution supprimée", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleAddRegion = async (e) => {
        e.preventDefault();
        if (!newRegion.name.trim()) return;
        try {
            const response = await fetch('https://satpromax.com/api/settings/regions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newRegion.name.trim(), image: newRegion.image.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewRegion({ name: '', image: '' });
                showNotification("Région ajoutée", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteRegion = async (name) => {
        try {
            const response = await fetch(`https://satpromax.com/api/settings/regions/${encodeURIComponent(name)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Région supprimée", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    if (loading) return <div>Chargement des réglages...</div>;

    return (
        <div className="admin-card">
            {confirmModal.isOpen && (
                <div className="modal-overlay" style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', maxWidth: '400px', width: '90%', textAlign: 'center', padding: '30px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#fee2e2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: '#ef4444'
                        }}>
                            <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Confirmation</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
                            Êtes-vous sûr de vouloir supprimer <strong>{confirmModal.item}</strong> ? Cette action est irréversible.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={closeConfirmModal}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#fff',
                                    color: '#64748b',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.type === 'paymentMode') handleDeleteMode(confirmModal.item);
                                    else if (confirmModal.type === 'deviceChoice') handleDeleteChoice(confirmModal.item);
                                    else if (confirmModal.type === 'resolution') handleDeleteResolution(confirmModal.item);
                                    else if (confirmModal.type === 'region') handleDeleteRegion(confirmModal.item);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: '#fff',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h2>Détails Généraux</h2>
            <p className="text-muted">Gérez les configurations globales du site.</p>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div style={{ marginTop: '20px', padding: '20px', background: '#fefce8', borderRadius: '12px', border: '1px solid #fef08a', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', color: '#854d0e', marginBottom: '10px' }}>Identifiants Administrateur</h3>
                <p style={{ fontSize: '13px', color: '#a16207', marginBottom: '15px' }}>Ces identifiants sont utilisés pour accéder à cet espace d'administration.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Admin</label>
                        <input
                            type="email"
                            value={settings.adminEmail || ''}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Mot de passe Admin</label>
                        <input
                            type="text"
                            value={settings.adminPassword || ''}
                            onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', color: '#065f46', marginBottom: '10px' }}>Configuration Email (Envoi de codes)</h3>
                <p style={{ fontSize: '13px', color: '#047857', marginBottom: '15px' }}>Ces identifiants sont utilisés pour envoyer les codes de réinitialisation de mot de passe (Gmail App Password requis).</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Expéditeur</label>
                        <input
                            type="email"
                            value={settings.senderEmail || ''}
                            onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                            className="form-input"
                            placeholder="ex: kmejri57@gmail.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Mot de passe d'application</label>
                        <input
                            type="text"
                            value={settings.senderPassword || ''}
                            onChange={(e) => setSettings({ ...settings, senderPassword: e.target.value })}
                            className="form-input"
                            placeholder="ex: msbcmujsbkqnsabc"
                        />
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('https://satpromax.com/api/settings', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        adminEmail: settings.adminEmail, // Keep these to prevent overwrite with null if API expects full object or partial updates work fine (Mongoose usually fine with partial).
                                        adminPassword: settings.adminPassword,
                                        // New fields
                                        senderEmail: settings.senderEmail,
                                        senderPassword: settings.senderPassword
                                    })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showNotification("Configuration Email mise à jour", "success");
                                }
                            } catch (err) {
                                showNotification("Erreur", "error");
                            }
                        }}
                        className="btn btn-primary"
                        style={{ height: '42px', background: '#10b981', borderColor: '#059669' }}
                    >
                        Mettre à jour
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', color: '#065f46', marginBottom: '10px' }}>Configuration Email notification</h3>
                <p style={{ fontSize: '13px', color: '#047857', marginBottom: '15px' }}>Ces identifiants sont utilisés pour envoyer les notifications de commande (Gmail App Password requis).</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Expéditeur</label>
                        <input
                            type="email"
                            value={settings.notificationSenderEmail || ''}
                            onChange={(e) => setSettings({ ...settings, notificationSenderEmail: e.target.value })}
                            className="form-input"
                            placeholder="ex: kmejri57@gmail.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Mot de passe d'application</label>
                        <input
                            type="text"
                            value={settings.notificationSenderPassword || ''}
                            onChange={(e) => setSettings({ ...settings, notificationSenderPassword: e.target.value })}
                            className="form-input"
                            placeholder="ex: msacmuasnjmnszxp"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Destinataire</label>
                        <input
                            type="email"
                            value={settings.notificationReceiverEmail || ''}
                            onChange={(e) => setSettings({ ...settings, notificationReceiverEmail: e.target.value })}
                            className="form-input"
                            placeholder="ex: mejrik1888@gmail.com"
                        />
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('https://satpromax.com/api/settings', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        notificationSenderEmail: settings.notificationSenderEmail,
                                        notificationSenderPassword: settings.notificationSenderPassword,
                                        notificationReceiverEmail: settings.notificationReceiverEmail
                                    })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showNotification("Configuration Notification Email mise à jour", "success");
                                }
                            } catch (err) {
                                showNotification("Erreur", "error");
                            }
                        }}
                        className="btn btn-primary"
                        style={{ height: '42px', background: '#10b981', borderColor: '#059669' }}
                    >
                        Mettre à jour
                    </button>
                </div>
            </div>


            <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', color: '#0c4a6e', marginBottom: '10px' }}>Configuration WhatsApp</h3>
                <p style={{ fontSize: '13px', color: '#0369a1', marginBottom: '15px' }}>Ce numéro sera utilisé pour recevoir les commandes par message.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Numéro WhatsApp (Complet avec code pays)</label>
                        <input
                            type="text"
                            value={settings.whatsappNumber || ''}
                            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                            className="form-input"
                            placeholder="ex: 21697496300"
                        />
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('https://satpromax.com/api/settings', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ whatsappNumber: settings.whatsappNumber })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showNotification("Numéro WhatsApp mis à jour avec succès", "success");
                                } else {
                                    showNotification("Erreur lors de la mise à jour", "error");
                                }
                            } catch (err) {
                                showNotification("Erreur de connexion au serveur", "error");
                            }
                        }}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-end', height: '42px' }}
                    >
                        Mettre à jour
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '30px', padding: '20px', background: '#fdf2f2', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', color: '#991b1b', marginBottom: '10px' }}>Couleur du Titre Produit</h3>
                <p style={{ fontSize: '13px', color: '#b91c1c', marginBottom: '15px' }}>Modifiez la couleur du titre dans la page de détails du produit.</p>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input
                        type="color"
                        value={settings.productTitleColor || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, productTitleColor: e.target.value })}
                        style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    />
                    <input
                        type="text"
                        value={settings.productTitleColor || '#ffffff'}
                        onChange={(e) => setSettings({ ...settings, productTitleColor: e.target.value })}
                        className="form-input"
                        style={{ width: '120px' }}
                    />
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('https://satpromax.com/api/settings', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ productTitleColor: settings.productTitleColor })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showNotification("Couleur du titre mise à jour", "success");
                                }
                            } catch (err) {
                                showNotification("Erreur", "error");
                            }
                        }}
                        className="btn btn-primary"
                    >
                        Mettre à jour
                    </button>
                </div>
            </div>

            {/* Resolutions Management */}
            <div style={{ marginTop: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Gestion des Résolutions</h3>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <form onSubmit={handleAddResolution} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }}>Nom de la résolution</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: 4K, FHD"
                                value={newResolution.name}
                                onChange={(e) => setNewResolution({ ...newResolution, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }}>URL de l'image</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="https://..."
                                value={newResolution.image}
                                onChange={(e) => setNewResolution({ ...newResolution, image: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px', borderRadius: '8px', padding: '0 20px' }}>
                            Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                    {settings.resolutions && settings.resolutions.map((res, index) => (
                        <div key={index} style={{ background: '#fff', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {res.image ? <img src={res.image} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }}>📺</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>{res.name}</span>
                            <button
                                onClick={() => openConfirmModal(res.name, 'resolution')}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regions Management */}
            <div style={{ marginTop: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Gestion des Régions</h3>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <form onSubmit={handleAddRegion} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }}>Nom de la région</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: Europe, Monde, USA"
                                value={newRegion.name}
                                onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }}>URL de l'image</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="https://..."
                                value={newRegion.image}
                                onChange={(e) => setNewRegion({ ...newRegion, image: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px', borderRadius: '8px', padding: '0 20px' }}>
                            Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                    {settings.regions && settings.regions.map((reg, index) => (
                        <div key={index} style={{ background: '#fff', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {reg.image ? <img src={reg.image} alt={reg.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }}>🌍</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>{reg.name}</span>
                            <button
                                onClick={() => openConfirmModal(reg.name, 'region')}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Modes de Paiement</h3>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '15px' }}>Ajouter un nouveau mode</h4>
                    <form onSubmit={handleAddMode} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>Nom du mode</label>
                            <input
                                type="text"
                                value={newMode.name}
                                onChange={(e) => setNewMode({ ...newMode, name: e.target.value })}
                                placeholder="ex: D17, Flouci, Sobflous"
                                className="form-input"
                                style={{ height: '45px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>URL du Logo (Lien Image)</label>
                            <input
                                type="text"
                                value={newMode.logo}
                                onChange={(e) => setNewMode({ ...newMode, logo: e.target.value })}
                                placeholder="https://image-link.com/logo.png"
                                className="form-input"
                                style={{ height: '45px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '45px', padding: '0 25px', fontWeight: '700' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Ajouter
                        </button>
                    </form>
                </div>


                <div className="payment-modes-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {settings.paymentModes && settings.paymentModes.map((mode, index) => (
                        <div key={index} className="payment-mode-admin-card" style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #f1f5f9',
                                    padding: '8px'
                                }}>
                                    {mode.logo ? (
                                        <img src={mode.logo} alt={mode.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ fontSize: '20px' }}>💳</div>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '700', color: '#1e293b', display: 'block', fontSize: '14px' }}>{mode.name}</span>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{mode.logo ? 'Logo avec lien' : 'Sans logo'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => openConfirmModal(mode.name, 'paymentMode')}
                                style={{
                                    background: '#fff',
                                    border: '1px solid #fee2e2',
                                    color: '#ef4444',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    ))}
                    {(!settings.paymentModes || settings.paymentModes.length === 0) && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0', color: '#94a3b8', fontStyle: 'italic' }}>
                            Aucun mode de paiement défini. Ajoutez-en un ci-dessus.
                        </div>
                    )}
                </div>

            </div>

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Choix d'appareil (IPTV)</h3>

                <form onSubmit={handleAddChoice} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={newChoice}
                        onChange={(e) => setNewChoice(e.target.value)}
                        placeholder="Nouveau choix (ex: TV, Application)"
                        className="form-input"
                        style={{ maxWidth: '300px' }}
                    />
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>

                <div className="device-choices-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {settings.deviceChoices && settings.deviceChoices.map((choice, index) => (
                        <div key={index} style={{
                            background: '#fff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500',
                            color: '#334155',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            {choice}
                            <button
                                type="button"
                                onClick={() => openConfirmModal(choice, 'deviceChoice')}
                                style={{
                                    background: '#fee2e2',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {(!settings.deviceChoices || settings.deviceChoices.length === 0) && (
                        <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Aucun choix d'appareil défini. Ajoutez-en un ci-dessus.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GuidesManager = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);
    const [newGuide, setNewGuide] = useState({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        category: "Guides d'installation",
        sections: [],
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });
    const [pageSettings, setPageSettings] = useState({
        guideHeroImage: '',
        guidePageBgImage: ''
    });

    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [linkGenerator, setLinkGenerator] = useState({ type: 'product', id: '', customTitle: '', customUrl: '' });

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchOtherData = async () => {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch('https://satpromax.com/api/products'),
                fetch('https://satpromax.com/api/categories')
            ]);
            const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
            if (pData.success) setAvailableProducts(pData.data);
            if (cData.success) setAvailableCategories(cData.data);
        } catch (error) {
            console.error("Error fetching helper data:", error);
        }
    };

    const fetchGuides = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/guides`);
            const data = await res.json();
            if (data.success) {
                setGuides(data.data);
            }
            // Fetch page settings
            const settingsRes = await fetch(`${API_BASE_URL}/api/settings`);
            const settingsData = await settingsRes.json();
            if (settingsData.success) {
                setPageSettings({
                    guideHeroImage: settingsData.data.guideHeroImage || '',
                    guidePageBgImage: settingsData.data.guidePageBgImage || ''
                });
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSavePageSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageSettings)
            });
            const data = await res.json();
            if (data.success) {
                showNotification("Paramètres de la page mis à jour", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    useEffect(() => {
        fetchGuides();
        fetchOtherData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const method = editingGuide ? 'PUT' : 'POST';
        const url = editingGuide
            ? `${API_BASE_URL}/api/guides/${editingGuide._id}`
            : `${API_BASE_URL}/api/guides`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGuide)
            });
            const data = await res.json();
            if (data.success) {
                showNotification(editingGuide ? "Article mis à jour" : "Article créé", "success");
                setIsModalOpen(false);
                setEditingGuide(null);
                setNewGuide({ title: '', content: '', excerpt: '', image: '', category: "Guides d'installation", sections: [], metaTitle: '', metaDescription: '', keywords: '' });
                fetchGuides();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/guides/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification("Article supprimé", "success");
                fetchGuides();
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const addSection = () => {
        setNewGuide({
            ...newGuide,
            sections: [...newGuide.sections, { title: '', content: '', image: '' }]
        });
    };

    const updateSection = (index, field, value) => {
        const updatedSections = [...newGuide.sections];
        updatedSections[index] = { ...updatedSections[index], [field]: value };
        setNewGuide({ ...newGuide, sections: updatedSections });
    };

    const removeSection = (index) => {
        const updatedSections = newGuide.sections.filter((_, i) => i !== index);
        setNewGuide({ ...newGuide, sections: updatedSections });
    };

    const handleEdit = (guide) => {
        setEditingGuide(guide);
        setNewGuide({
            title: guide.title,
            content: guide.content,
            excerpt: guide.excerpt || '',
            image: guide.image || '',
            category: guide.category || "Guides d'installation",
            sections: guide.sections || [],
            metaTitle: guide.metaTitle || '',
            metaDescription: guide.metaDescription || '',
            keywords: guide.keywords || ''
        });
        setIsModalOpen(true);
    };

    const filteredGuides = guides.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-card">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Gestion des Guides d'installation</h2>
                <button className="btn btn-primary" onClick={() => { setEditingGuide(null); setIsModalOpen(true); }}>
                    + Ajouter un Article
                </button>
            </div>

            {/* Page Settings Section */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '15px' }}>Paramètres de la page Guide</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Image Hero (Bouton Blog & Article)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={pageSettings.guideHeroImage}
                            onChange={(e) => setPageSettings({ ...pageSettings, guideHeroImage: e.target.value })}
                            placeholder="URL de l'image Hero"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Image Fond de Page (Background)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={pageSettings.guidePageBgImage}
                            onChange={(e) => setPageSettings({ ...pageSettings, guidePageBgImage: e.target.value })}
                            placeholder="URL de l'image de fond"
                        />
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '14px' }}
                    onClick={handleSavePageSettings}
                >
                    Enregistrer les paramètres de page
                </button>
            </div>

            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Chercher un article..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuides.map(guide => (
                            <tr key={guide._id}>
                                <td>
                                    <img src={guide.image || "https://premium.satpromax.com/wp-content/uploads/2024/09/Logo-sat-PRO-MAX-site-e1726059632832.png"} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                </td>
                                <td style={{ fontWeight: 'bold' }}>{guide.title}</td>
                                <td>{new Date(guide.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" onClick={() => handleEdit(guide)}>Modifier</button>
                                        <button className="btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(guide._id)}>Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <h3>{editingGuide ? "Modifier l'Article" : "Nouvel Article"}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Titre *</label>
                                <input
                                    className="form-input"
                                    value={newGuide.title}
                                    onChange={e => setNewGuide({ ...newGuide, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    className="form-input"
                                    value={newGuide.image}
                                    onChange={e => setNewGuide({ ...newGuide, image: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Extrait (Excerpt)</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: '60px' }}
                                    value={newGuide.excerpt}
                                    onChange={e => setNewGuide({ ...newGuide, excerpt: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Introduction (Optionnel)</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: '100px' }}
                                    value={newGuide.content}
                                    onChange={e => setNewGuide({ ...newGuide, content: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                                    CRÉER UN LIEN DANS LE TEXTE (Lien Bleu)
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr auto', gap: '8px' }}>
                                    <input
                                        className="form-input"
                                        placeholder="Le mot ou la phrase à cliquer..."
                                        value={linkGenerator.customTitle}
                                        onChange={e => setLinkGenerator({ ...linkGenerator, customTitle: e.target.value })}
                                        style={{ height: '38px', fontSize: '13px' }}
                                    />

                                    <input
                                        className="form-input"
                                        placeholder="Lien ou URL (ex: /contact ou https://...)"
                                        value={linkGenerator.customUrl}
                                        onChange={e => setLinkGenerator({ ...linkGenerator, customUrl: e.target.value })}
                                        style={{ height: '38px', fontSize: '13px' }}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const text = linkGenerator.customTitle || "Cliquez ici";
                                            const url = linkGenerator.customUrl;
                                            if (!url) return showNotification("Veuillez saisir une destination", "error");

                                            const html = `<a href="${url}">${text}</a>`;
                                            navigator.clipboard.writeText(html);
                                            showNotification("Lien copié !", "success");
                                        }}
                                        style={{ height: '38px', padding: '0 15px', fontSize: '12px' }}
                                    >
                                        Copier HTML
                                    </button>
                                </div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>* Écrivez le texte, collez l'URL, copiez puis collez le code HTML dans votre article.</p>
                            </div>


                            <div style={{ marginBottom: '25px', padding: '20px', background: '#f1f5f9', borderRadius: '15px', border: '1px dashed #cbd5e1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: '#334155', fontWeight: '800' }}>SECTIONS DE L'ARTICLE</h4>
                                    <button type="button" className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={addSection}>+ Ajouter Section</button>
                                </div>

                                {newGuide.sections.map((section, index) => (
                                    <div key={index} style={{ background: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                                        <button
                                            type="button"
                                            onClick={() => removeSection(index)}
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                                        >
                                            &times;
                                        </button>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '12px' }}>Titre de Section</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={section.title}
                                                onChange={e => updateSection(index, 'title', e.target.value)}
                                                placeholder="Ex: Comment installer..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '12px' }}>Texte de Section</label>
                                            <textarea
                                                className="form-input"
                                                style={{ height: '100px' }}
                                                value={section.content}
                                                onChange={e => updateSection(index, 'content', e.target.value)}
                                                placeholder="Contenu de cette section..."
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label" style={{ fontSize: '12px' }}>Image explicative (Optionnel)</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={section.image}
                                                onChange={e => updateSection(index, 'image', e.target.value)}
                                                placeholder="URL de l'image"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {newGuide.sections.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Aucune section ajoutée. Cliquez sur le bouton ci-dessus pour commencer.</p>}
                            </div>

                            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b', fontWeight: '800' }}>PARAMÈTRES SEO (Article)</h4>
                                <div className="form-group">
                                    <label className="form-label">Meta Nom</label>
                                    <input className="form-input" value={newGuide.metaTitle} onChange={e => setNewGuide({ ...newGuide, metaTitle: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Description</label>
                                    <textarea className="form-input" style={{ height: '60px' }} value={newGuide.metaDescription} onChange={e => setNewGuide({ ...newGuide, metaDescription: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Mot Clé</label>
                                    <input className="form-input" value={newGuide.keywords} onChange={e => setNewGuide({ ...newGuide, keywords: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div >
    );
};

// Reviews Manager Component
const ReviewsManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [reviewType, setReviewType] = useState('general'); // 'general' or 'product'
    const [newReviewForm, setNewReviewForm] = useState({
        username: '',
        comment: '',
        rating: 5,
        status: 'approved',
        productId: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`);
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews`);
            const data = await response.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (data.success) {
                setNotification({ message: `Commentaire ${status === 'approved' ? 'approuvé' : 'rejeté'}`, type: 'success' });
                fetchReviews();
            }
        } catch (error) {
            setNotification({ message: "Erreur lors de la mise à jour", type: 'error' });
        }
    };

    const handleDeleteReview = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setNotification({ message: "Commentaire supprimé", type: 'success' });
                setDeleteModal({ show: false, id: null });
                fetchReviews();
            }
        } catch (error) {
            setNotification({ message: "Erreur lors de la suppression", type: 'error' });
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const body = { ...newReviewForm };
            if (reviewType === 'general') {
                delete body.productId;
            }
            const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.success) {
                setNotification({ message: "Avis ajouté avec succès", type: 'success' });
                setIsAddModalOpen(false);
                setNewReviewForm({ username: '', comment: '', rating: 5, status: 'approved', productId: '' });
                fetchReviews();
            }
        } catch (error) {
            setNotification({ message: "Erreur lors de l'ajout", type: 'error' });
        }
    };

    useEffect(() => {
        if (isAddModalOpen) {
            fetchProducts();
        }
    }, [isAddModalOpen]);

    return (
        <div className="manager-view">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="view-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        background: '#eff6ff',
                        padding: '10px',
                        borderRadius: '10px',
                        color: '#3b82f6'
                    }}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Gestion des Commentaires</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Gérez et modérez les avis de vos clients</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        background: '#f8fafc',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#475569',
                        border: '1px solid #e2e8f0'
                    }}>
                        Total: {reviews.length}
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            fontWeight: '700'
                        }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Ajouter un avis
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Chargement des commentaires...</div>
            ) : (
                <div className="table-container" style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <table className="admin-table">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Utilisateur</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Commentaire</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Note</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Statut</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '15px 20px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#3b82f6' }}>{review.username.charAt(0).toUpperCase()}</div>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{review.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <p style={{ maxWidth: '350px', fontSize: '14px', color: '#475569', margin: 0, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={review.comment}>{review.comment}</p>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ color: '#fbbf24', fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', background: review.status === 'approved' ? '#dcfce7' : '#fff9c4', color: review.status === 'approved' ? '#166534' : '#854d0e', border: `1px solid ${review.status === 'approved' ? '#bbf7d0' : '#fef08a'}` }}>{review.status === 'approved' ? 'Approuvé' : 'En attente'}</span>
                                    </td>
                                    <td style={{ padding: '15px 20px', fontSize: '13px', color: '#64748b' }}>{new Date(review.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {review.status === 'pending' && (
                                                <button className="btn btn-primary" onClick={() => handleStatusUpdate(review._id, 'approved')} style={{ padding: '6px 14px', fontSize: '12px', background: '#10b981' }}>Approuver</button>
                                            )}
                                            <button className="btn btn-danger" onClick={() => handleDeleteReview(review._id)} style={{ padding: '6px 14px', fontSize: '12px', background: '#fee2e2', color: '#ef4444' }}>Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '30px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        animation: 'modalFadeUp 0.3s ease-out'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#fee2e2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: '#ef4444'
                        }}>
                            <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Confirmation de suppression</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes modalFadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />

            {/* Add Review Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '35px',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'modalFadeUp 0.3s ease-out'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '25px', textAlign: 'center' }}>Ajouter un nouvel avis</h2>

                        <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Nom d'utilisateur</label>
                                <input
                                    className="form-input"
                                    value={newReviewForm.username}
                                    onChange={e => setNewReviewForm({ ...newReviewForm, username: e.target.value })}
                                    placeholder="Ex: Ahmed Ben Salem"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Note (Étoiles)</label>
                                <select
                                    className="form-input"
                                    value={newReviewForm.rating}
                                    onChange={e => setNewReviewForm({ ...newReviewForm, rating: parseInt(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <option key={num} value={num}>{num} Étoiles</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Commentaire</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: '100px', padding: '12px' }}
                                    value={newReviewForm.comment}
                                    onChange={e => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                                    placeholder="Rédigez l'avis ici..."
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Type d'avis</label>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: reviewType === 'general' ? '#3b82f6' : '#64748b' }}>
                                        <input type="radio" checked={reviewType === 'general'} onChange={() => setReviewType('general')} />
                                        Général (Home)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: reviewType === 'product' ? '#3b82f6' : '#64748b' }}>
                                        <input type="radio" checked={reviewType === 'product'} onChange={() => setReviewType('product')} />
                                        Spécifique à un produit
                                    </label>
                                </div>
                            </div>

                            {reviewType === 'product' && (
                                <div className="form-group" style={{ marginBottom: 0, animation: 'fadeIn 0.3s' }}>
                                    <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }}>Sélectionner le produit</label>
                                    <select
                                        className="form-input"
                                        value={newReviewForm.productId}
                                        onChange={e => setNewReviewForm({ ...newReviewForm, productId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Choisir un produit --</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{ flex: 1, padding: '12px', background: '#f8fafc', fontWeight: '700' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '12px', fontWeight: '800' }}
                                >
                                    Enregistrer l'avis
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Guide Inquiries Manager Component
const GuideInquiriesManager = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/guide-inquiries`);
            const data = await response.json();
            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette question ?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/guide-inquiries/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setNotification({ message: "Question supprimée", type: 'success' });
                fetchInquiries();
            }
        } catch (error) {
            setNotification({ message: "Erreur lors de la suppression", type: 'error' });
        }
    };

    return (
        <div className="manager-view">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="view-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }}>
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Questions sur les Articles</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>{inquiries.length} question(s) en attente de réponse</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="admin-loader"></div>
                    <p style={{ color: '#64748b', marginTop: '15px' }}>Chargement des questions...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                }}>
                    {inquiries.map((inquiry) => (
                        <div key={inquiry._id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#eff6ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#3b82f6',
                                        fontWeight: '800',
                                        fontSize: '18px'
                                    }}>
                                        {inquiry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{inquiry.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(inquiry.createdAt).toLocaleString('fr-FR')}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(inquiry._id)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        cursor: 'pointer'
                                    }}
                                    title="Supprimer"
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>

                            <div style={{
                                background: '#f8fafc',
                                padding: '10px 15px',
                                borderRadius: '10px',
                                marginBottom: '15px',
                                fontSize: '13px',
                                color: '#475569',
                                borderLeft: '4px solid #3b82f6'
                            }}>
                                <span style={{ fontWeight: 'bold', color: '#334155' }}>Article :</span> {inquiry.articleTitle}
                            </div>

                            <div style={{
                                flex: 1,
                                padding: '15px',
                                background: '#fff',
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9',
                                marginBottom: '20px',
                                position: 'relative'
                            }}>
                                <svg width="20" height="20" fill="#f1f5f9" style={{ position: 'absolute', top: '-10px', left: '10px' }} viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V18C14.017 14.134 17.151 11 21.017 11V14.334C19.1837 14.334 17.6837 15.834 17.6837 17.6673H21.017V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C11.1216 16 12.017 16.8954 12.017 18V21C12.017 22.1046 11.1216 23 10.017 23H7.01697C5.9124 23 5.01697 22.1046 5.01697 21ZM5.01697 21V18C5.01697 14.134 8.15097 11 12.017 11V14.334C10.1836 14.334 8.68364 15.834 8.68364 17.6673H12.017V21C12.017 22.1046 11.1216 23 10.017 23H7.01697C5.9124 23 5.01697 22.1046 5.01697 21Z" /></svg>
                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#334155', fontWeight: '500' }}>
                                    {inquiry.question}
                                </p>
                            </div>

                            <a
                                href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${inquiry.name}, à propos de votre question sur l'article "${inquiry.articleTitle}" : `)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '14px',
                                    background: '#25d366',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    fontSize: '14px',
                                    transition: 'background 0.2s',
                                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#128c7e'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#25d366'}
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82c1.516.903 3.124 1.379 4.773 1.38h.005c5.441 0 9.869-4.427 9.871-9.87.001-2.636-1.026-5.115-2.892-6.983-1.866-1.868-4.346-2.895-6.983-2.896-5.442 0-9.87 4.427-9.873 9.871-.001 1.739.456 3.437 1.321 4.925l-.83 3.033 3.108-.815zm11.411-7.55c-.171-.086-1.014-.5-1.171-.557-.157-.057-.271-.086-.385.086-.114.172-.442.557-.542.671-.1.114-.2.128-.371.043-.171-.086-.723-.266-1.377-.849-.51-.454-.853-1.014-.953-1.186-.1-.171-.011-.264.075-.349.076-.076.171-.2.257-.3.085-.1.114-.171.171-.3.057-.128.028-.243-.014-.328-.043-.086-.385-.929-.528-1.272-.14-.335-.282-.289-.385-.294-.1-.005-.214-.006-.328-.006-.114 0-.3.043-.457.214-.157.172-.6.586-.6 1.429 0 .843.614 1.657.7 1.771.086.115 1.209 1.846 2.928 2.587.409.176.728.281.977.36.41.13.784.112 1.078.068.329-.049 1.014-.414 1.157-.814.143-.4.143-.743.1-.814-.043-.071-.157-.114-.328-.2z" /></svg>
                                Répondre sur WhatsApp
                            </a>
                        </div>
                    ))}
                    {inquiries.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            padding: '60px',
                            textAlign: 'center',
                            background: '#fff',
                            borderRadius: '20px',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📁</div>
                            <h3 style={{ color: '#1e293b', fontWeight: '800' }}>Aucune question pour le moment</h3>
                            <p style={{ color: '#64748b' }}>Les questions posées par les clients sur les articles apparaîtront ici.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Contact Messages Manager Component
const ContactMessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/contact-messages`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/contact-messages/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setNotification({ message: "Message supprimé", type: 'success' });
                fetchMessages();
            }
        } catch (error) {
            setNotification({ message: "Erreur lors de la suppression", type: 'error' });
        }
    };

    return (
        <div className="manager-view">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="view-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}>
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Messages de Contact</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>{messages.length} message(s) reçu(s)</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="admin-loader"></div>
                    <p style={{ color: '#64748b', marginTop: '15px' }}>Chargement des messages...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '20px'
                }}>
                    {messages.map((msg) => (
                        <div key={msg._id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '25px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transition: 'transform 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#475569',
                                        fontWeight: '800'
                                    }}>
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{msg.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(msg.createdAt).toLocaleString('fr-FR')}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>Sujet</div>
                                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{msg.subject}</div>
                            </div>

                            <div style={{
                                flex: 1,
                                padding: '18px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9',
                                marginBottom: '20px',
                                color: '#475569',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.message}
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a
                                    href={`https://wa.me/${msg.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${msg.name}, à propos de votre message : "${msg.subject}"...`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        padding: '12px',
                                        background: '#25d366',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}
                                >
                                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82c1.516.903 3.124 1.379 4.773 1.38h.005c5.441 0 9.869-4.427 9.871-9.87.001-2.636-1.026-5.115-2.892-6.983-1.866-1.868-4.346-2.895-6.983-2.896-5.442 0-9.87 4.427-9.873 9.871-.001 1.739.456 3.437 1.321 4.925l-.83 3.033 3.108-.815zm11.411-7.55c-.171-.086-1.014-.5-1.171-.557-.157-.057-.271-.086-.385.086-.114.172-.442.557-.542.671-.1.114-.2.128-.371.043-.171-.086-.723-.266-1.377-.849-.51-.454-.853-1.014-.953-1.186-.1-.171-.011-.264.075-.349.076-.076.171-.2.257-.3.085-.1.114-.171.171-.3.057-.128.028-.243-.014-.328-.043-.086-.385-.929-.528-1.272-.14-.335-.282-.289-.385-.294-.1-.005-.214-.006-.328-.006-.114 0-.3.043-.457.214-.157.172-.6.586-.6 1.429 0 .843.614 1.657.7 1.771.086.115 1.209 1.846 2.928 2.587.409.176.728.281.977.36.41.13.784.112 1.078.068.329-.049 1.014-.414 1.157-.814.143-.4.143-.743.1-.814-.043-.071-.157-.114-.328-.2z" /></svg>
                                    WhatsApp
                                </a>
                                <div style={{
                                    flex: 1,
                                    background: '#f1f5f9',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#475569'
                                }}>
                                    {msg.whatsapp}
                                </div>
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            padding: '100px 20px',
                            textAlign: 'center',
                            background: '#fff',
                            borderRadius: '24px',
                            border: '2px dashed #e2e8f0'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✉️</div>
                            <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '24px' }}>Aucun message reçu</h3>
                            <p style={{ color: '#64748b' }}>Les messages envoyés via la page de contact s'afficheront ici.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
/* --------------------------------------------------------------------- */
/*                           SUPPORT MANAGER                             */
/* --------------------------------------------------------------------- */

const SupportManager = () => {
    const [activeSubTab, setActiveSubTab] = useState('tickets');
    const [tickets, setTickets] = useState([]);

    // Configuration State
    const [issueTypes, setIssueTypes] = useState([]);
    const [formFields, setFormFields] = useState([]);

    // Add Field State
    const [newType, setNewType] = useState('');
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');
    const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [currentHeroImage, setCurrentHeroImage] = useState('');

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/tickets`);
            const data = await res.json();
            if (data.success) setTickets(data.data);
        } catch (error) {
            console.error(error);
            showNotification('Erreur lors du chargement des tickets', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/config`);
            const data = await res.json();
            if (data.success) {
                setIssueTypes(data.types);
                setFormFields(data.fields);
                setHeroImage(data.heroImage || '');
                setCurrentHeroImage(data.heroImage || '');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeSubTab === 'tickets') fetchTickets();
        if (activeSubTab === 'config') fetchConfig();
    }, [activeSubTab]);

    const initiateDeleteTicket = (id) => {
        setConfirmModal({
            show: true,
            title: 'Suppression Ticket',
            message: 'Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.',
            onConfirm: () => deleteTicket(id)
        });
    };

    const deleteTicket = async (id) => {
        setConfirmModal({ ...confirmModal, show: false });
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification('Ticket supprimé', 'success');
                fetchTickets();
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        }
    };

    // --- ISSUE TYPES HANDLERS ---
    const addType = async (e) => {
        e.preventDefault();
        if (!newType.trim()) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/types`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newType })
            });
            const data = await res.json();
            if (data.success) {
                showNotification('Type ajouté', 'success');
                setNewType('');
                setIssueTypes(data.data);
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        }
    };

    const initiateDeleteType = (name) => {
        setConfirmModal({
            show: true,
            title: 'Suppression Type',
            message: `Supprimer le type '${name}' ?`,
            onConfirm: () => deleteType(name)
        });
    };

    const deleteType = async (name) => {
        setConfirmModal({ ...confirmModal, show: false });
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/types/${name}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification('Type supprimé', 'success');
                setIssueTypes(data.data);
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        }
    };

    // --- FORM FIELDS HANDLERS ---
    const addField = async (e) => {
        e.preventDefault();
        if (!newFieldName.trim()) return;

        const newField = {
            label: newFieldName,
            type: newFieldType,
            placeholder: newFieldPlaceholder,
            required: true // Default to true
        };

        const updatedFields = [...formFields, newField];

        try {
            await saveFields(updatedFields);
            setNewFieldName('');
            setNewFieldPlaceholder('');
            showNotification('Champ ajouté', 'success');
        } catch (error) {
            // Error managed in saveFields
        }
    };

    const initiateDeleteField = (index) => {
        setConfirmModal({
            show: true,
            title: 'Suppression Champ',
            message: "Êtes-vous sûr de vouloir supprimer ce champ du formulaire ?",
            onConfirm: () => deleteField(index)
        });
    };

    const deleteField = async (index) => {
        setConfirmModal({ ...confirmModal, show: false });
        const updatedFields = formFields.filter((_, i) => i !== index);
        await saveFields(updatedFields);
        showNotification('Champ supprimé', 'success');
    };

    const saveFields = async (fields) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/fields`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields })
            });
            const data = await res.json();
            if (data.success) {
                setFormFields(data.data);
            } else {
                showNotification('Erreur sauvegarde', 'error');
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
            throw error;
        }
    };

    const saveHeroImage = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ heroImage })
            });
            const data = await res.json();
            if (data.success) {
                showNotification('Image de fond mise à jour', 'success');
                setCurrentHeroImage(data.heroImage);
            } else {
                showNotification('Erreur sauvegarde image', 'error');
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        }
    };

    // Custom Confirmation Modal
    const ConfirmationModal = () => {
        if (!confirmModal.show) return null;
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
                <div style={{
                    background: 'white', padding: '25px', borderRadius: '12px', width: '400px', maxWidth: '90%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'fadeIn 0.2s ease-out'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>{confirmModal.title || 'Confirmer'}</h3>
                    <p style={{ color: '#475569', marginBottom: '25px', lineHeight: '1.5' }}>{confirmModal.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0',
                                background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={confirmModal.onConfirm}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: 'none',
                                background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <ConfirmationModal />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#1e293b', fontWeight: '700' }}>Gestion de Support</h2>
                <div className="tab-buttons" style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    <button
                        style={{
                            padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s',
                            background: activeSubTab === 'tickets' ? 'white' : 'transparent',
                            color: activeSubTab === 'tickets' ? '#0f172a' : '#64748b',
                            boxShadow: activeSubTab === 'tickets' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => setActiveSubTab('tickets')}
                    >
                        Tickets Reçus
                    </button>
                    <button
                        style={{
                            padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s',
                            background: activeSubTab === 'config' ? 'white' : 'transparent',
                            color: activeSubTab === 'config' ? '#0f172a' : '#64748b',
                            boxShadow: activeSubTab === 'config' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => setActiveSubTab('config')}
                    >
                        Configuration Formulaire
                    </button>
                </div>
            </div>

            {activeSubTab === 'tickets' && (
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chargement des tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📪</div>
                            <h3 style={{ color: '#475569', marginBottom: '5px' }}>Aucun ticket de support</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Les nouvelles demandes apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div className="tickets-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '25px'
                        }}>
                            {tickets.map(ticket => (
                                <div key={ticket._id} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ticket.issueType === 'Reclamation' ? '#ef4444' : '#3b82f6'
                                    }}></div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '12px', fontWeight: 'bold', color: '#64748b',
                                                background: '#f1f5f9', padding: '6px 10px', borderRadius: '20px'
                                            }}>
                                                # {ticket._id.substr(-6)}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span style={{
                                            background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '700',
                                            padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px'
                                        }}>
                                            {ticket.issueType}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                                        {ticket.formDetails && ticket.formDetails.length > 0 ? (
                                            ticket.formDetails.map((field, i) => (
                                                <div key={i} style={{ marginBottom: '8px', fontSize: '14px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>{field.label}</span>
                                                    <span style={{ fontWeight: '600' }}>{field.value}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Nom</span>
                                                    <span style={{ fontWeight: '600' }}>{ticket.name}</span>
                                                </div>
                                                <div style={{ marginBottom: '8px', fontSize: '14px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>Whatsapp</span>
                                                    <span style={{ fontWeight: '600' }}>{ticket.whatsapp}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '20px', flex: 1 }}>
                                        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>Message</h4>
                                        <p style={{
                                            margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap', background: 'white', padding: '0',
                                        }}>
                                            {ticket.message}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                                        <button
                                            onClick={() => initiateDeleteTicket(ticket._id)}
                                            style={{
                                                background: 'white', color: '#ef4444', border: '1px solid #fee2e2',
                                                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                                transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#fee2e2'; }}
                                        >
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Supprimer le Ticket
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSubTab === 'config' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* SECTION 0: HERO IMAGE */}
                    <div className="config-section" style={{
                        background: '#fff',
                        padding: '25px',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#3b82f6' }}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Photo de couverture (Support)</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>Image Actuelle</label>
                                <div style={{
                                    width: '100%',
                                    height: '140px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    position: 'relative',
                                    background: '#f8fafc'
                                }}>
                                    <img src={currentHeroImage || '/images/support-hero-bg.png'} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' }}>EN LIGNE</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>Nouvelle Image (URL)</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Collez le nouveau lien ici..."
                                    value={heroImage}
                                    onChange={(e) => setHeroImage(e.target.value)}
                                    style={{ width: '100%', height: '100px', resize: 'none', marginBottom: '10px' }}
                                />
                                <button
                                    onClick={saveHeroImage}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '12px', fontWeight: '800' }}
                                    disabled={heroImage === currentHeroImage}
                                >
                                    Appliquer les changements
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* SECTION 1: DYNAMIC FIELDS */}
                    <div className="config-section">
                        <h3>Champs du Formulaire</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9em', marginBottom: '15px' }}>Ajoutez les champs que l'utilisateur doit remplir (ex: Nom, WhatsApp, ID commande).</p>

                        <form onSubmit={addField} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Libellé (Label)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: Numéro de Téléphone"
                                        value={newFieldName}
                                        onChange={(e) => setNewFieldName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ width: '120px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Type</label>
                                    <select
                                        className="form-input"
                                        value={newFieldType}
                                        onChange={(e) => setNewFieldType(e.target.value)}
                                    >
                                        <option value="text">Texte</option>
                                        <option value="number">Nombre</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Placeholder (Indicatif)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: +216 55 ..."
                                        value={newFieldPlaceholder}
                                        onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Ajouter</button>
                            </div>
                        </form>

                        <div className="fields-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {formFields.map((field, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'white', border: '1px solid #e2e8f0', padding: '10px 15px', borderRadius: '6px'
                                }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>{field.label}</span>
                                        <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>{field.type}</span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>{field.placeholder || 'Pas de placeholder'}</span>
                                    </div>
                                    <button
                                        onClick={() => initiateDeleteField(index)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                            {formFields.length === 0 && <p style={{ color: '#94a3b8' }}>Aucun champ configuré.</p>}
                        </div>
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #e2e8f0' }} />

                    {/* SECTION 2: ISSUE TYPES */}
                    <div className="config-section">
                        <h3>Types de Problèmes (Menu déroulant)</h3>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <form onSubmit={addType} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nouveau type de problème..."
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary">Ajouter</button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {issueTypes.map((type, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', background: 'white',
                                    border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px'
                                }}>
                                    <span style={{ fontWeight: '500', marginRight: '10px' }}>{type.name}</span>
                                    <button
                                        onClick={() => initiateDeleteType(type.name)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
