import React, { useState, useEffect } from 'react';
import './Admin.css';

// SVG Icons (Simple placeholders)
const IconProduct = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconOrder = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const IconClient = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconHome = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;

export default function Admin() {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsManager />;
            case 'orders':
                return <OrdersManager />;
            case 'clients':
                return <ClientsManager />;
            case 'home':
                return <HomeManager />;
            case 'reviews':
                return <ReviewsManager />;
            case 'details':
                return <SettingsManager />;
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
                        className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        Gestion de commentaires
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
                        {activeTab === 'reviews' && 'Gestion de Commentaires'}
                        {activeTab === 'details' && 'Détails Généraux'}
                    </div>
                    <div className="admin-user-info">Admin User</div>
                </div>

                <div className="admin-main-view">
                    {renderContent()}
                </div>
            </main>
        </div>
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
        <div className="modal-overlay" onClick={onClose}>
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

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'delete'
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', image: '', category: 'Streaming', description: '', skuList: [], tagsList: [],
        metaTitle: '', metaDescription: '', resolution: '', region: '', downloadLink: '', galleryList: [],
        descriptionGlobal: '', extraSections: []
    });
    const [notification, setNotification] = useState(null);

    const [categories, setCategories] = useState(['Streaming', 'IPTV Premium', 'Music', 'Box Android', 'Gaming', 'Gift Card', 'Software']);

    useEffect(() => {
        // Fetch dynamic categories from settings
        fetch('http://localhost:3000/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data && data.data.categories && data.data.categories.length > 0) {
                    setCategories(data.data.categories);
                    // Update default category in form if currently on the old default
                    if (formData.category === 'Streaming' && !data.data.categories.includes('Streaming')) {
                        setFormData(prev => ({ ...prev, category: data.data.categories[0] }));
                    }
                }
            })
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchProducts = () => {
        setLoading(true);
        fetch('http://localhost:3000/api/products')
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
            extraSections: []
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
            extraSections: product.extraSections || []
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

        let url = 'http://localhost:3000/api/products';
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
            const response = await fetch(`http://localhost:3000/api/products/${currentProduct._id}`, {
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

    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestion des Produits</h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    + Ajouter un produit
                </button>
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

                    {(formData.category === 'IPTV Premium' || formData.category === 'IPTV & Sharing') && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label className="form-label">Résolution (ex: 4K, FHD)</label>
                                    <input type="text" name="resolution" className="form-input" value={formData.resolution} onChange={handleInputChange} placeholder="Ex: 4K" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Région (ex: Tunisie, Global)</label>
                                    <input type="text" name="region" className="form-input" value={formData.region} onChange={handleInputChange} placeholder="Ex: Tunisie" />
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
    const [statusModal, setStatusModal] = useState({ open: false, orderId: null, currentStatus: '' });
    const [deleteModal, setDeleteModal] = useState({ open: false, type: 'single', targetId: null });

    const fetchOrders = () => {
        setLoading(true);
        fetch('http://localhost:3000/api/orders')
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
                ? 'http://localhost:3000/api/orders'
                : `http://localhost:3000/api/orders/${deleteModal.targetId}`;

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
            const response = await fetch(`http://localhost:3000/api/orders/${statusModal.orderId}/status`, {
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


    if (loading) return <div>Chargement des commandes...</div>;

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2>Gestion de Commandes</h2>
                    <p className="text-muted">Suivez et traitez les commandes des clients.</p>
                </div>
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
                            transition: 'all 0.2s'
                        }}
                    >
                        🗑️ Supprimer tout
                    </button>
                )}
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


            {orders.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f9fafb', borderRadius: '8px' }}>
                    Aucune commande trouvée.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Produits</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Client</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Contact</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Total</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Statut</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
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
                                                            {item.deviceChoice && (
                                                                <span style={{ marginLeft: '10px', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                                                                    {item.deviceChoice}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>
                                        {order.userValidation?.name || order.userId?.username || 'Client'}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontSize: '12px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#334155' }}>{order.userValidation?.whatsapp}</div>
                                            <div style={{ color: '#64748b' }}>{order.userValidation?.address}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#16a34a' }}>{order.totalAmount} DT</td>
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
        fetch('http://localhost:3000/api/users')
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
            const response = await fetch(`http://localhost:3000/api/users/${user._id}/role`, {
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
    return (
        <div className="admin-card">
            <h2>Personnalisation de l'Accueil</h2>
            <p className="text-muted">Modifiez les bannières, les sections mises en avant, etc.</p>
            <br />
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
                Contenu de la gestion de la page d'accueil ici...
            </div>
        </div>
    );
};

const SettingsManager = () => {
    const [settings, setSettings] = useState({ paymentModes: [], deviceChoices: [], categories: [] });
    const [newMode, setNewMode] = useState({ name: '', logo: '' });
    const [newChoice, setNewChoice] = useState('');
    const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
    const [editingCategory, setEditingCategory] = useState(null); // original name
    const [editValue, setEditValue] = useState({ name: '', icon: '' }); // new name and icon
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
        // Use the same timeout as the main Notification component (3s)
        // Note: The main Notification component handles its own timeout via useEffect, 
        // so we just need to set the state here.
    };

    const fetchSettings = () => {
        setLoading(true);
        fetch('http://localhost:3000/api/settings')
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
            const response = await fetch('http://localhost:3000/api/settings/payment-modes', {
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
            const response = await fetch(`http://localhost:3000/api/settings/payment-modes/${encodeURIComponent(mode)}`, {
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
            const response = await fetch('http://localhost:3000/api/settings/device-choices', {
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
            const response = await fetch(`http://localhost:3000/api/settings/device-choices/${encodeURIComponent(choice)}`, {
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

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/api/settings/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory.name.trim(), icon: newCategory.icon.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewCategory({ name: '', icon: '' });
                showNotification("Catégorie ajoutée avec succès", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        try {
            const response = await fetch(`http://localhost:3000/api/settings/categories/${encodeURIComponent(categoryName)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Catégorie supprimée", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        }
    };

    const handleUpdateCategory = async (oldCategoryName) => {
        if (!editValue.name.trim()) {
            setEditingCategory(null);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/settings/categories/${encodeURIComponent(oldCategoryName)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newCategory: editValue.name.trim(),
                    newIcon: editValue.icon.trim()
                })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setEditingCategory(null);
                showNotification("Catégorie mise à jour", "success");
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
                <div className="modal-overlay" onClick={closeConfirmModal} style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                                    else if (confirmModal.type === 'category') handleDeleteCategory(confirmModal.item);
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
                                const res = await fetch('http://localhost:3000/api/settings', {
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

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#334155' }}>Gestion des Catégories</h3>

                <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nom de catégorie (ex: Streaming)"
                        className="form-input"
                        style={{ maxWidth: '250px' }}
                    />
                    <input
                        type="text"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="Icône (emoji ou lien URL)"
                        className="form-input"
                        style={{ maxWidth: '200px' }}
                    />
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>

                <div className="categories-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {settings.categories && settings.categories.map((cat, index) => {
                        const catName = typeof cat === 'object' ? cat.name : cat;
                        const catIcon = typeof cat === 'object' ? cat.icon : '';

                        return (
                            <div key={index} style={{
                                background: editingCategory === catName ? '#fff' : '#f1f5f9',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: editingCategory === catName ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: '500',
                                color: '#475569',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                {editingCategory === catName ? (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={editValue.name}
                                            onChange={(e) => setEditValue(prev => ({ ...prev, name: e.target.value }))}
                                            autoFocus
                                            style={{ fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', width: '100px' }}
                                        />
                                        <input
                                            type="text"
                                            value={editValue.icon || ''}
                                            onChange={(e) => setEditValue(prev => ({ ...prev, icon: e.target.value }))}
                                            placeholder="Icône"
                                            style={{ fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', width: '80px' }}
                                        />
                                        <button onClick={() => handleUpdateCategory(catName)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}>OK</button>
                                        <button onClick={() => setEditingCategory(null)} style={{ background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                                    </div>
                                ) : (
                                    <>
                                        {catIcon ? (
                                            catIcon.startsWith('http') ? (
                                                <img src={catIcon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ fontSize: '18px' }}>{catIcon}</span>
                                            )
                                        ) : (
                                            <span style={{ fontSize: '18px' }}>📁</span>
                                        )}
                                        <span style={{ cursor: 'pointer' }} onClick={() => { setEditingCategory(catName); setEditValue({ name: catName, icon: catIcon || '' }); }}>{catName}</span>
                                        <button
                                            type="button"
                                            onClick={() => openConfirmModal(catName, 'category')}
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
                                    </>
                                )}
                            </div>
                        );
                    })}
                    {(!settings.categories || settings.categories.length === 0) && (
                        <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Aucune catégorie définie. Ajoutez-en une ci-dessus.</div>
                    )}
                </div>
            </div>
        </div >
    );
};

// Reviews Manager Component
const ReviewsManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/reviews');
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
            const response = await fetch(`http://localhost:3000/api/reviews/${id}`, {
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
            const response = await fetch(`http://localhost:3000/api/reviews/${id}`, {
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
        </div>
    );
};