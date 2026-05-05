import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import { ShopContext } from '../context/ShopContext';

import { API_BASE_URL } from '../config';
import TwoFactorSetup from '../components/TwoFactorSetup';

// SVG Icons (Simple placeholders)
// SVG Icons (Professional & Consistent)
const IconProduct = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconPromo = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const IconOrder = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconClient = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconHome = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconCategory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSubCategory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const IconReview = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const IconGuide = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconQuestion = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconMessage = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconSupport = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconApp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const Icon2FA = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconBtn = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><path d="M7 12h10"></path></svg>;
const IconSEO = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

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
    const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'home');
    const [globalSeoOpen, setGlobalSeoOpen] = useState(false);
    const [preSelectedSeo, setPreSelectedSeo] = useState({ type: 'home', id: '' });

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsManager openGlobalSeo={(type, id) => { setGlobalSeoOpen(true); setPreSelectedSeo({ type, id }); }} />;
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
            case 'subcategories':
                return <SubCategoryManager openGlobalSeo={(parentId, subId) => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'subcategory', id: parentId + '|' + subId }); }} />;
            case 'reviews':
                return <ReviewsManager openGlobalSeo={() => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'reviews' }); }} />;
            case 'buttons':
                return <ButtonManager />;
            case 'details':
                return <SettingsManager />;
            case 'guides':
                return <GuidesManager openGlobalSeo={() => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'guides' }); }} />;
            case 'inquiries':
                return <GuideInquiriesManager openGlobalSeo={() => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'questions' }); }} />;
            case 'messages':
                return <ContactMessagesManager openGlobalSeo={() => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'contact' }); }} />;
            case 'support':
                return <SupportManager openGlobalSeo={() => { setGlobalSeoOpen(true); setPreSelectedSeo({ type: 'support' }); }} />;
            case 'applications':
                return <ApplicationsManager />;
            case '2fa':
                return <TwoFactorManager />;
            default:
                return <ProductsManager />;
        }
    };

    return (
        <div className="admin-container">
            <div className="floating-bg">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>
            {/* Sidebar / Navbar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">Satpromax</div>
                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <IconProduct /> <span>Gestion de produit</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'promos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('promos')}
                    >
                        <IconPromo /> <span>Gestion des Promos</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <IconOrder /> <span>Gestion de commande</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clients')}
                    >
                        <IconClient /> <span>Gestion de client</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        <IconHome /> <span>Gestion de page home</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <IconCategory /> <span>Gestion des Catégories</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'subcategories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subcategories')}
                    >
                        <IconSubCategory /> <span>Gestion de Sous-catégories</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <IconReview /> <span>Gestion de commentaires</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'guides' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guides')}
                    >
                        <IconGuide /> <span>Gestion des Guides</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        <IconQuestion /> <span>Questions Articles</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <IconMessage /> <span>Messages Contact</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'support' ? 'active' : ''}`}
                        onClick={() => setActiveTab('support')}
                    >
                        <IconSupport /> <span>Gestion de Support</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <IconSettings /> <span>Détails Généraux</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'buttons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('buttons')}
                    >
                        <IconBtn /> <span>Gestion de button</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <IconApp /> <span>Gestion Applications</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === '2fa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('2fa')}
                    >
                        <Icon2FA /> <span>Gestion 2FA</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-content">
                <header className="admin-header">
                    <div className="admin-title">
                        {activeTab === 'products' && 'Gestion de Produits'}
                        {activeTab === 'orders' && 'Gestion de Commandes'}
                        {activeTab === 'clients' && 'Gestion de Clients'}
                        {/* ... other titles ... */}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                        <button
                            onClick={() => setGlobalSeoOpen(true)}
                            className="btn-premium btn-edit"
                            style={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderColor: 'rgba(99, 102, 241, 0.2)',
                                color: '#a5b4fc',
                                padding: '10px 20px'
                            }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            SEO Global
                        </button>
                        <div className="user-profile">
                            <div className="user-avatar">AD</div>
                            <span>Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="admin-main-view">
                    {renderContent()}
                </div>
            </main>

            {/* Global SEO Modal */}
            <GlobalSeoModal isOpen={globalSeoOpen} onClose={() => setGlobalSeoOpen(false)} initialData={preSelectedSeo} />
        </div>
    );
}

// Global SEO Modal Component
const GlobalSeoModal = ({ isOpen, onClose, initialData }) => {
    const [targetType, setTargetType] = useState('home'); // home, product, category, subcategory
    const [targetId, setTargetId] = useState(''); // productId or category name. For subcategory: "ParentName|SubName"
    const [parentCategory, setParentCategory] = useState(''); // Only for subcategory selection inside modal ui
    const [subCategory, setSubCategory] = useState(''); // Only for subcategory selection inside modal ui
    // Data for selectors
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [seoData, setSeoData] = useState({
        h1: '',
        subheadings: [], // { level: 'h2', text: '' }
        metaTitle: '',
        metaDescription: ''
    });

    // Fetch initial data
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTargetType(initialData.type || 'home');
                setTargetId(initialData.id || '');
                if (initialData.type === 'subcategory' && initialData.id) {
                    const [p, s] = initialData.id.split('|');
                    if (p && s) {
                        setParentCategory(p);
                        setSubCategory(s);
                    }
                }
            }
            fetchSettings();
            fetchProducts();
        }
    }, [isOpen, initialData]);

    const fetchSettings = () => {
        fetch(`${API_BASE_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setSettings(data.data);
            });
    };

    const fetchProducts = () => {
        fetch(`${API_BASE_URL}/api/products?limit=1000`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.data);
            });
    };

    // When selection changes, populate form
    useEffect(() => {
        if (!settings) return;

        if (targetType === 'home') {
            setSeoData({
                h1: settings.homeSeoH1 || '',
                subheadings: settings.homeSeoSubheadings || [],
                metaTitle: settings.homeMetaTitle || '',
                metaDescription: settings.homeMetaDescription || ''
            });
        } else if (targetType === 'contact') {
            setSeoData({
                h1: settings.contactPageSeo?.h1 || '',
                subheadings: settings.contactPageSeo?.subheadings || [],
                metaTitle: '', metaDescription: ''
            });
        } else if (targetType === 'support') {
            setSeoData({
                h1: settings.supportPageSeo?.h1 || '',
                subheadings: settings.supportPageSeo?.subheadings || [],
                metaTitle: '', metaDescription: ''
            });
        } else if (targetType === 'reviews') {
            setSeoData({
                h1: settings.reviewsPageSeo?.h1 || '',
                subheadings: settings.reviewsPageSeo?.subheadings || [],
                metaTitle: '', metaDescription: ''
            });
        } else if (targetType === 'guides') {
            setSeoData({
                h1: settings.guidesPageSeo?.h1 || '',
                subheadings: settings.guidesPageSeo?.subheadings || [],
                metaTitle: '', metaDescription: ''
            });
        } else if (targetType === 'questions') {
            setSeoData({
                h1: settings.questionsPageSeo?.h1 || '',
                subheadings: settings.questionsPageSeo?.subheadings || [],
                metaTitle: '', metaDescription: ''
            });
        } else if (targetType === 'category' && targetId) {
            const cat = settings.categories.find(c => c.name === targetId);
            if (cat) {
                setSeoData({
                    h1: cat.seoH1 || '',
                    subheadings: cat.seoSubheadings || [],
                    metaTitle: cat.metaTitle || '',
                    metaDescription: cat.metaDescription || ''
                });
            }
        } else if (targetType === 'subcategory') {
            // targetId might be pre-set, or we use parentCategory/subCategory state
            let pName = parentCategory;
            let sName = subCategory;

            if (targetId && targetId.includes('|')) {
                [pName, sName] = targetId.split('|');
            }

            if (settings && settings.categories) {
                const cat = settings.categories.find(c => c.name === pName);
                if (cat && cat.subCategories) {
                    const sub = cat.subCategories.find(s => s.name === sName);
                    if (sub) {
                        setSeoData({
                            h1: sub.seoH1 || '',
                            subheadings: sub.seoSubheadings || [],
                            metaTitle: '', metaDescription: ''
                        });
                    } else {
                        setSeoData({ h1: '', subheadings: [], metaTitle: '', metaDescription: '' });
                    }
                }
            }
        } else if (targetType === 'product' && targetId) {
            const prod = products.find(p => p._id === targetId);
            if (prod) {
                setSeoData({
                    h1: prod.seoH1 || '',
                    subheadings: prod.seoSubheadings || [],
                    metaTitle: '', metaDescription: ''
                });
            }
        } else {
            // Reset if no selection
            setSeoData({ h1: '', subheadings: [], metaTitle: '', metaDescription: '' });
        }
    }, [targetType, targetId, settings, products]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (targetType === 'home') {
                const newSettings = {
                    ...settings,
                    homeSeoH1: seoData.h1,
                    homeSeoSubheadings: seoData.subheadings,
                    homeMetaTitle: seoData.metaTitle,
                    homeMetaDescription: seoData.metaDescription
                };
                await fetch(`${API_BASE_URL}/api/settings`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                });
            } else if (['contact', 'support', 'reviews', 'guides', 'questions'].includes(targetType)) {
                const fieldName = `${targetType}PageSeo`;
                const newSettings = { ...settings, [fieldName]: { h1: seoData.h1, subheadings: seoData.subheadings } };
                await fetch(`${API_BASE_URL}/api/settings`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                });
            } else if (targetType === 'category') {
                const newSettings = { ...settings };
                const catIndex = newSettings.categories.findIndex(c => c.name === targetId);
                if (catIndex !== -1) {
                    newSettings.categories[catIndex].seoH1 = seoData.h1;
                    newSettings.categories[catIndex].seoSubheadings = seoData.subheadings;
                    newSettings.categories[catIndex].metaTitle = seoData.metaTitle;
                    newSettings.categories[catIndex].metaDescription = seoData.metaDescription;
                    await fetch(`${API_BASE_URL}/api/settings`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSettings)
                    });
                }
            } else if (targetType === 'subcategory') {
                const newSettings = { ...settings };
                // Use state directly if targetId is empty or rely on splitting targetId if it was passed
                let pName = parentCategory;
                let sName = subCategory;
                if (targetId && targetId.includes('|')) {
                    [pName, sName] = targetId.split('|');
                }

                const catIndex = newSettings.categories.findIndex(c => c.name === pName);
                if (catIndex !== -1) {
                    if (!newSettings.categories[catIndex].subCategories) newSettings.categories[catIndex].subCategories = [];
                    const subIndex = newSettings.categories[catIndex].subCategories.findIndex(s => s.name === sName);

                    if (subIndex !== -1) {
                        newSettings.categories[catIndex].subCategories[subIndex].seoH1 = seoData.h1;
                        newSettings.categories[catIndex].subCategories[subIndex].seoSubheadings = seoData.subheadings;
                    } else {
                        // If somehow it doesn't exist, create it (auto-fix)
                        newSettings.categories[catIndex].subCategories.push({
                            name: sName,
                            seoH1: seoData.h1,
                            seoSubheadings: seoData.subheadings
                        });
                    }
                    await fetch(`${API_BASE_URL}/api/settings`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSettings)
                    });
                }
            } else if (targetType === 'product') {
                await fetch(`${API_BASE_URL}/api/products/${targetId}/seo`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(seoData)
                });
            }
            alert("SEO mis à jour avec succès !");
            onClose();
            // Refresh settings locally if needed
            fetchSettings();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('admin-modal-open');
        } else {
            document.body.classList.remove('admin-modal-open');
        }
        return () => document.body.classList.remove('admin-modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Optimisation SEO Globale">
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label className="form-label">Type de Page</label>
                    <select
                        className="form-select"
                        value={targetType}
                        onChange={(e) => {
                            setTargetType(e.target.value);
                            setTargetId('');
                        }}
                    >
                        <option value="home">Page d'accueil</option>
                        <option value="products">Tous les Produits</option>
                        <option value="guides">Tous les Articles</option>
                        <option value="reviews">Tous les Commentaires</option>
                        <option value="questions">Toutes les Questions</option>
                        <option value="contact">Page Contact</option>
                        <option value="support">Page Support</option>
                        <option value="category">Catégorie</option>
                        <option value="subcategory">Sous-Catégorie</option>
                        <option value="product">Produit</option>
                    </select>
                </div>

                {targetType === 'subcategory' && settings && (
                    <div style={{ display: 'flex', gap: '10px' }} >
                        <div className="form-group" style={{ flex: 1 }} >
                            <label className="form-label">Catégorie Parente</label>
                            <select
                                className="form-select"
                                value={parentCategory}
                                onChange={e => {
                                    setParentCategory(e.target.value);
                                    setSubCategory('');
                                    setTargetId(''); // Clear targetId so we rely on state
                                }}
                            >
                                <option value="">-- Choisir Parente --</option>
                                {settings.categories.map((c, i) => (
                                    <option key={i} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }} >
                            <label className="form-label">Sous-Catégorie</label>
                            <select
                                className="form-select"
                                value={subCategory}
                                onChange={e => {
                                    setSubCategory(e.target.value);
                                    setTargetId(parentCategory + '|' + e.target.value); // Set targetID for consistency
                                }}
                                disabled={!parentCategory}
                            >
                                <option value="">-- Choisir Sous-Catégorie --</option>
                                {settings.categories.find(c => c.name === parentCategory)?.subCategories?.map((s, i) => (
                                    <option key={i} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {targetType === 'category' && settings && (
                    <div className="form-group">
                        <label className="form-label">Choisir la Catégorie</label>
                        <select
                            className="form-select"
                            value={targetId}
                            onChange={e => setTargetId(e.target.value)}
                            required
                        >
                            <option value="">-- Sélectionner --</option>
                            {settings.categories.map((c, i) => (
                                <option key={i} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {targetType === 'product' && (
                    <div className="form-group">
                        <label className="form-label">Choisir le Produit</label>
                        <select
                            className="form-select"
                            value={targetId}
                            onChange={e => setTargetId(e.target.value)}
                            required
                        >
                            <option value="">-- Sélectionner --</option>
                            {products.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {(targetType === 'home' || targetType === 'category') && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Meta Title (Titre Navigateur)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={seoData.metaTitle}
                                onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
                                placeholder="Titre pour moteurs de recherche..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Description</label>
                            <textarea
                                className="form-input"
                                value={seoData.metaDescription}
                                onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                                placeholder="Description pour moteurs de recherche..."
                                style={{ height: '80px', resize: 'vertical' }}
                            />
                        </div>
                        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid var(--border)' }} />
                    </>
                )}

                {(targetType === 'home' || targetType === 'contact' || targetType === 'support' || targetType === 'reviews' || targetType === 'guides' || targetType === 'questions' || targetId || (targetType === 'subcategory' && subCategory)) && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Titre Principal (H1)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={seoData.h1}
                                onChange={(e) => setSeoData({ ...seoData, h1: e.target.value })}
                                placeholder="Titre H1..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sous-titres (H2, H3, ...)</label>
                            {seoData.subheadings.map((sub, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }} >
                                    <select
                                        className="form-select"
                                        style={{ width: '80px' }}
                                        value={sub.level}
                                        onChange={(e) => {
                                            const newSubs = [...seoData.subheadings];
                                            newSubs[index].level = e.target.value;
                                            setSeoData({ ...seoData, subheadings: newSubs });
                                        }}
                                    >
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                        <option value="h4">H4</option>
                                        <option value="h5">H5</option>
                                        <option value="h6">H6</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={sub.text}
                                        onChange={(e) => {
                                            const newSubs = [...seoData.subheadings];
                                            newSubs[index].text = e.target.value;
                                            setSeoData({ ...seoData, subheadings: newSubs });
                                        }}
                                        placeholder="Texte..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSubs = seoData.subheadings.filter((_, i) => i !== index);
                                            setSeoData({ ...seoData, subheadings: newSubs });
                                        }}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0 10px', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setSeoData({ ...seoData, subheadings: [...seoData.subheadings, { level: 'h2', text: '' }] })}
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                                + Ajouter
                            </button>
                        </div>
                    </>
                )}

                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {loading ? (
                            <>
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                <span>Sauvegarde...</span>
                            </>
                        ) : (
                            'Sauvegarder SEO'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// ---------------------------------------------------------------------
// Placeholder Components for each section
// ---------------------------------------------------------------------

// Notification Component
const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification-container">
            <div className={`notification ${type}`} style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '16px 24px'
            }}
            >
                <div className="notification-icon" style={{
                    background: type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: type === 'success' ? '#10b981' : '#ef4444',
                    width: '44px', height: '44px'
                }} >
                    {type === 'success' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    )}
                </div>
                <div className="notification-content">
                    <div className="notification-title" style={{ color: '#fff', fontSize: '15px' }} >{type === 'success' ? 'Succès' : 'Attention'}</div>
                    <div className="notification-message" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }} >{message}</div>
                </div>
                <button className="modal-close" onClick={onClose} style={{ marginLeft: '10px' }} >&times;</button>
            </div>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('admin-modal-open');
        } else {
            document.body.classList.remove('admin-modal-open');
        }
        return () => document.body.classList.remove('admin-modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Helper Component for Multiple Inputs (Tags/SKU)
const MultiInput = ({ items, onAdd, onRemove, placeholder, onFileUpload, uploading }) => {
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }} >
                <input
                    type="text"
                    className="form-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                {onFileUpload && (
                    <div style={{ position: 'relative' }} >
                        <input
                            type="file"
                            onChange={(e) => onFileUpload(e)}
                            style={{ display: 'none' }}
                            id={`multi-file-${placeholder.replace(/\s+/g, '')}`}
                            accept="image/*"
                            disabled={uploading}
                        />
                        <label
                            htmlFor={`multi-file-${placeholder.replace(/\s+/g, '')}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '42px',
                                height: '42px',
                                background: '#f1f5f9',
                                borderRadius: '8px',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                border: '1px solid var(--border)',
                                fontSize: '18px',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}
                            title="Télécharger une image"
                        >
                            {uploading ? (
                                <div className="admin-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} ></div>
                            ) : '📁'}
                        </label>
                    </div>
                )}
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} >
                {items.map((item, index) => (
                    <span key={index} style={{
                        background: 'var(--surface-hover)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid var(--border)'
                    }} >
                        {onFileUpload && (item.startsWith('http') || item.startsWith('/')) ? (
                            <img src={item} alt="" style={{ width: '16px', height: '16px', borderRadius: '3px', objectFit: 'cover' }} />
                        ) : null}
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
        fetch(`${API_BASE_URL}/api/products?limit=1000`)
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
        setSubmitting(true);

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
            const response = await fetch(`${API_BASE_URL}/api/products/${currentProduct._id}`, {
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
        } finally {
            setSubmitting(false);
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
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }} >
                <p style={{ margin: 0, color: 'var(--text-muted)' }} >Sélectionnez un produit pour ajouter ou modifier une promotion.</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} >
                    <button
                        className={`btn ${showOnlyPromos ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowOnlyPromos(!showOnlyPromos)}
                        style={{ minWidth: '220px', padding: '12px 32px' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={showOnlyPromos ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        {showOnlyPromos ? 'Voir Tout' : '☆ Voir Promos Actives'}
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
                <div key={category} style={{ marginBottom: '30px' }} >
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px', color: 'var(--text-main)', fontSize: '18px', fontWeight: '800' }} >{category}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }} >
                        {groupedProducts[category].map(product => {
                            const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();
                            return (
                                <div
                                    key={product._id}
                                    onClick={() => openPromoModal(product)}
                                    style={{
                                        border: isPromoActive ? '2px solid var(--danger)' : '1px solid var(--border)',
                                        borderRadius: '20px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.03)',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        boxShadow: 'var(--shadow-sm)',
                                        backdropFilter: 'blur(5px)'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = isPromoActive ? 'var(--danger)' : 'var(--border)';
                                    }}
                                >
                                    {isPromoActive && <div style={{ position: 'absolute', top: -10, right: -5, background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }} >PROMO ACTIVE</div>}
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }} >
                                        <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                    </div>
                                    <h4 style={{ fontSize: '14px', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >{product.name}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                        <span style={{ fontWeight: 'bold', fontSize: '13px' }} >{product.price}</span>
                                        {isPromoActive && <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }} >{product.promoPrice}</span>}
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
                        <div style={{ display: 'flex', gap: '10px' }} >
                            <div style={{ flex: 1 }} >
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationDays}
                                    onChange={e => setPromoData({ ...promoData, promoDurationDays: e.target.value })}
                                    min="0"
                                />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }} >Jours</span>
                            </div>
                            <div style={{ flex: 1 }} >
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationHours}
                                    onChange={e => setPromoData({ ...promoData, promoDurationHours: e.target.value })}
                                    min="0" max="23"
                                />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }} >Heures</span>
                            </div>
                            <div style={{ flex: 1 }} >
                                <input
                                    type="number"
                                    className="form-input"
                                    value={promoData.promoDurationMinutes}
                                    onChange={e => setPromoData({ ...promoData, promoDurationMinutes: e.target.value })}
                                    min="0" max="59"
                                />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }} >Minutes</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Enregistrement...</span>
                                </>
                            ) : (
                                'Enregistrer la Promo'
                            )}
                        </button>
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
        name: '', price: '', image: '', category: 'Streaming', subCategory: '', description: '', skuList: [], tagsList: [],
        metaTitle: '', metaDescription: '', resolution: '', region: '', downloadLink: '', galleryList: [],
        descriptionGlobal: '', extraSections: [], hasDelivery: false, deliveryPrice: '', hasTest: false
    });
    const [notification, setNotification] = useState(null);
    const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalOrders: 0, totalUsers: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [linkGenerator, setLinkGenerator] = useState({ customTitle: '', customUrl: '' });
    const [submitting, setSubmitting] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchStats = () => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data.data);
            })
            .catch(err => console.error("Stats fetch error:", err));
    };

    const fetchUsers = () => {
        fetch(`${API_BASE_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setUsers(data.data);
                }
            })
            .catch(err => console.error("Users fetch error:", err));
    };

    const fetchOrders = () => {
        fetch(`${API_BASE_URL}/api/orders`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setOrders(data.data);
                }
            })
            .catch(err => console.error("Orders fetch error:", err));
    };

    const fetchProducts = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/products?limit=1000`)
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
        fetchUsers();
        fetchOrders();
        fetchStats();
        fetch(`${API_BASE_URL}/api/settings`)
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

    const handleFileUpload = async (e, targetField, galleryIndex = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();
            if (data.success) {
                if (targetField === 'image') {
                    setFormData(prev => ({ ...prev, image: data.imageUrl }));
                } else if (targetField === 'gallery') {
                    const newList = [...formData.galleryList];
                    newList[galleryIndex] = data.imageUrl;
                    setFormData(prev => ({ ...prev, galleryList: newList }));
                }
                showNotification("Image téléchargée avec succès !", "success");
            } else {
                showNotification(data.message || "Erreur lors du téléchargement", "error");
            }
        } catch (error) {
            console.error(error);
            showNotification("Erreur de connexion lors du téléchargement", "error");
        } finally {
            setUploading(false);
        }
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
            subCategory: '',
            description: '',
            skuList: [],
            tagsList: [],
            metaTitle: '',
            metaDescription: '',
            resolution: '',
            region: '',
            downloadLink: '',
            googlePlayLink: '',
            galleryList: [],
            descriptionGlobal: '',
            extraSections: [],
            hasDelivery: false,
            deliveryPrice: '',
            hasTest: false,
            hasBouquets: false,
            selectedBouquets: [],
            hasSubscriptionFormats: false,
            selectedSubscriptionFormats: []
        });
        setModalOpen(true);
    };

    const openEditModal = async (product) => {
        setModalType('edit');
        setCurrentProduct(product);

        try {
            // Root Fix: Always fetch the freshest and complete data for editing
            const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`);
            const result = await res.json();

            if (result.success && result.data) {
                const fullProduct = result.data;

                // Convert comma-separated strings to arrays
                const skuList = fullProduct.sku ? fullProduct.sku.split(',').map(s => s.trim()).filter(s => s) : [];
                const tagsList = fullProduct.tags ? fullProduct.tags.split(',').map(t => t.trim()).filter(t => t) : [];

                setFormData({
                    name: fullProduct.name || '',
                    price: fullProduct.price || '',
                    image: fullProduct.image || '',
                    category: fullProduct.category || '',
                    subCategory: fullProduct.subCategory || '',
                    description: fullProduct.description || '',
                    skuList: skuList,
                    tagsList: tagsList,
                    metaTitle: fullProduct.metaTitle || '',
                    metaDescription: fullProduct.metaDescription || '',
                    resolution: fullProduct.resolution || '',
                    region: fullProduct.region || '',
                    downloadLink: fullProduct.downloadLink || '',
                    googlePlayLink: fullProduct.googlePlayLink || '',
                    galleryList: fullProduct.gallery || [],
                    descriptionGlobal: fullProduct.descriptionGlobal || '',
                    extraSections: fullProduct.extraSections || [],
                    hasDelivery: fullProduct.hasDelivery || false,
                    deliveryPrice: fullProduct.deliveryPrice || '',
                    hasTest: fullProduct.hasTest || false,
                    hasBouquets: fullProduct.hasBouquets || false,
                    selectedBouquets: fullProduct.selectedBouquets || [],
                    hasSubscriptionFormats: fullProduct.hasSubscriptionFormats || false,
                    selectedSubscriptionFormats: fullProduct.selectedSubscriptionFormats || []
                });
                setModalOpen(true);
            } else {
                showNotification("Erreur: Impossible de charger les détails complets du produit.", "error");
            }
        } catch (err) {
            console.error("Fetch error in openEditModal:", err);
            showNotification("Erreur de connexion au serveur.", "error");
        }
    };

    const openDeleteModal = (product) => {
        setModalType('delete');
        setCurrentProduct(product);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        let url = `${API_BASE_URL}/api/products`;
        let method = 'POST';

        if (modalType === 'edit') {
            url += `/${currentProduct._id}`;
            method = 'PUT';
        }

        // Prepare data for backend (convert arrays back to strings)
        const submissionData = {
            ...formData,
            hasTest: formData.hasTest, // Explicitly include hasTest
            hasBouquets: formData.hasBouquets,
            selectedBouquets: formData.selectedBouquets,
            hasSubscriptionFormats: formData.hasSubscriptionFormats,
            selectedSubscriptionFormats: formData.selectedSubscriptionFormats,
            sku: formData.skuList.join(', '),
            tags: formData.tagsList.join(', '),
            gallery: formData.galleryList.filter(url => url.trim() !== ''),
            extraSections: formData.extraSections.filter(s => (s.title && s.title.trim() !== '') || (s.items && s.items.length > 0) || (s.content && s.content.trim() !== ''))
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${currentProduct._id}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStock = async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
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

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }} >Chargement des produits...</div>;

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }} >
                <h2 className="admin-title" style={{ margin: 0 }} >Gestion de Produits</h2>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <div className="stat-label">Total Produits</div>
                        <div className="stat-value">{products.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <div className="stat-label">Total Ventes</div>
                        <div className="stat-value">
                            {orders.filter(o => o.status === 'Livré').reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0).toFixed(2)} DT
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <div className="stat-label">Total Commandes</div>
                        <div className="stat-value">{orders.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-label">Total Clients</div>
                        <div className="stat-value">{users.length}</div>
                    </div>
                </div>
            </div>

            <div className="inventory-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
                <button className="btn btn-premium btn-add-compact" onClick={openAddModal}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Ajouter un Produit
                </button>

                <div className="search-minimal" style={{ flex: 1, maxWidth: '400px', margin: 0 }}>
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-minimal"
                    />
                </div>
            </div>

            {Object.keys(groupedProducts).length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }} >
                    Aucun produit trouvé dans la base de données.
                </div>
            ) : (
                Object.keys(groupedProducts).map(category => (
                    <div key={category} style={{ marginBottom: '50px' }} >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }} >
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }} >{category}</h3>
                            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border)' }} >
                                {groupedProducts[category].length} produits
                            </span>
                        </div>

                        <div className="product-list">
                            <div className="product-row" style={{ background: 'transparent', border: 'none', padding: '0 24px 12px 24px', opacity: 0.5, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >
                                <div>Image</div>
                                <div>Détails du Produit</div>
                                <div style={{ textAlign: 'right' }} >Actions</div>
                            </div>
                            {groupedProducts[category].map(product => (
                                <div key={product._id} className="product-row">
                                    <div className="product-img-box">
                                        <img src={product.image} alt="" />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px' }} >{product.name}</div>
                                            <div style={{ fontWeight: '800', color: 'var(--success)', fontSize: '15px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 10px', borderRadius: '8px' }} >{product.price}</div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                                            {product.category}
                                            {product.hasTest && <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.1)', padding: '1px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: '800', border: '1px solid rgba(99, 102, 241, 0.2)' }} >TEST GRATUIT</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} >
                                        <button onClick={() => openEditModal(product)} className="btn-premium btn-edit" title="Modifier">
                                            <span>✏️</span>
                                        </button>
                                        <button onClick={() => handleToggleStock(product)} className="btn-premium btn-status" title={product.inStock !== false ? 'Disponible' : 'Épuisé'}>
                                            {product.inStock !== false ? '✅' : '❌'}
                                        </button>
                                        <button onClick={() => { setModalOpen(true); setModalType('delete'); setCurrentProduct(product); }} className="btn-premium btn-delete" title="Supprimer">
                                            <span>🗑️</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Modal for Add/Edit */}
            <Modal
                isOpen={modalOpen && (modalType === 'add' || modalType === 'edit')}
                onClose={() => setModalOpen(false)}
                title={modalType === 'add' ? '✨ Ajouter un Nouveau Produit' : '📝 Modifier le Produit'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                            Informations Générales
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom du produit</label>
                            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required placeholder="Ex: Orca Promax IPTV..." />
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Prix (DT)</label>
                                <input type="text" name="price" className="form-input" value={formData.price} onChange={handleInputChange} required placeholder="Ex: 75DT" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catégorie</label>
                                <select name="category" className="form-select" value={formData.category} onChange={e => {
                                    handleInputChange(e);
                                    setFormData(prev => ({ ...prev, category: e.target.value, subCategory: '' }));
                                }} >
                                    {categories.map(cat => {
                                        const name = typeof cat === 'object' ? cat.name : cat;
                                        return <option key={name} value={name}>{name}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Sous-Catégorie</label>
                                <select
                                    name="subCategory"
                                    className="form-select"
                                    value={formData.subCategory || ''}
                                    onChange={handleInputChange}
                                    disabled={!formData.category}
                                >
                                    <option value="">-- Aucune --</option>
                                    {settings.categories && settings.categories.find(c => c.name === formData.category)?.subCategories?.map((sub, idx) => (
                                        <option key={idx} value={sub.name}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image Principale (URL)</label>
                                <div style={{ display: 'flex', gap: '10px' }} >
                                    <input type="text" name="image" className="form-input" value={formData.image} onChange={handleInputChange} placeholder="/uploads/..." />
                                    <label className="btn btn-secondary" style={{ padding: '0 15px', height: '48px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                                        📁
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'main')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                            Options & Services
                        </div>
                        <div className="grid-2">
                            <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }} >
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasDelivery}
                                        onChange={(e) => setFormData({ ...formData, hasDelivery: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span style={{ marginLeft: '12px', fontWeight: '700', fontSize: '14px' }} >Livraison Payante</span>
                                {formData.hasDelivery && (
                                    <input
                                        type="text"
                                        name="deliveryPrice"
                                        className="form-input"
                                        value={formData.deliveryPrice}
                                        onChange={handleInputChange}
                                        placeholder="Prix (ex: 7 DT)"
                                        style={{ marginTop: '10px' }}
                                    />
                                )}
                            </div>
                            <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }} >
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasTest}
                                        onChange={(e) => setFormData({ ...formData, hasTest: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span style={{ marginLeft: '12px', fontWeight: '700', fontSize: '14px' }} >Test Gratuit 24H</span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '15px' }} >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }} >
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasBouquets}
                                        onChange={(e) => setFormData({ ...formData, hasBouquets: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span style={{ fontWeight: '700', fontSize: '14px' }} >Activer les Bouquets</span>
                            </div>
                            {formData.hasBouquets && (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxHeight: '180px', overflowY: 'auto', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }} >
                                    {settings.bouquets?.map(bouq => {
                                        const isSelected = formData.selectedBouquets?.includes(bouq.name);
                                        return (
                                            <div
                                                key={bouq.name}
                                                onClick={() => {
                                                    const current = formData.selectedBouquets || [];
                                                    const newSelection = isSelected ? current.filter(b => b !== bouq.name) : [...current, bouq.name];
                                                    setFormData({ ...formData, selectedBouquets: newSelection });
                                                }}
                                                style={{
                                                    border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                                    width: '80px',
                                                    textAlign: 'center',
                                                    transition: '0.2s'
                                                }}
                                            >
                                                <img src={bouq.image} style={{ width: '32px', height: '32px', objectFit: 'contain' }} alt="" />
                                                <div style={{ fontSize: '10px', fontWeight: '700', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }} >{bouq.name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {(formData.category === 'IPTV Premium' || formData.category === 'Abonnement IPTV') && (
                        <div className="form-section">
                            <div className="form-section-title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2z"></path><path d="M12 6V2"></path><path d="M7 2h10"></path></svg>
                                Paramètres IPTV
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Résolution</label>
                                    <select name="resolution" className="form-select" value={formData.resolution} onChange={handleInputChange}>
                                        <option value="">-- Sélectionner --</option>
                                        {settings.resolutions?.map(res => <option key={res.name} value={res.name}>{res.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Région</label>
                                    <select name="region" className="form-select" value={formData.region} onChange={handleInputChange}>
                                        <option value="">-- Sélectionner --</option>
                                        {settings.regions?.map(reg => <option key={reg.name} value={reg.name}>{reg.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Lien APK / Google Play</label>
                                <div className="grid-2">
                                    <input type="text" name="downloadLink" className="form-input" value={formData.downloadLink} onChange={handleInputChange} placeholder="Lien direct APK" />
                                    <input type="text" name="googlePlayLink" className="form-input" value={formData.googlePlayLink} onChange={handleInputChange} placeholder="Lien Google Play" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-section">
                        <div className="form-section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            SEO & Multimédia
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Meta Title (Google)</label>
                                <input type="text" name="metaTitle" className="form-input" value={formData.metaTitle} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Meta Description</label>
                                <input type="text" name="metaDescription" className="form-input" value={formData.metaDescription} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Galerie d'images (Secondaires)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }} >
                                {formData.galleryList.map((img, index) => (
                                    <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '100px', background: 'rgba(255,255,255,0.05)' }} >
                                        {img ? (
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }} >🖼️</div>
                                        )}
                                        <button type="button" onClick={() => setFormData({ ...formData, galleryList: formData.galleryList.filter((_, i) => i !== index) })} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >×</button>
                                    </div>
                                ))}
                                <label className="btn btn-secondary" style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px', border: '1px dashed rgba(255,255,255,0.2)', cursor: 'pointer', background: 'transparent' }} >
                                    <span style={{ fontSize: '20px' }} >+</span>
                                    <span style={{ fontSize: '10px' }} >Ajouter</span>
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'gallery', formData.galleryList.length)} />
                                </label>
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <MultiInput items={formData.skuList} onAdd={addSku} onRemove={removeSku} placeholder="SKU + Entrée" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <MultiInput items={formData.tagsList} onAdd={addTag} onRemove={removeTag} placeholder="Tag + Entrée" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Description Détaillée (Premium)
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description Courte</label>
                            <textarea name="description" className="form-textarea" value={formData.description} onChange={handleInputChange} placeholder="Bref résumé du produit..."></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Introduction (Description Globale)</label>
                            <textarea name="descriptionGlobal" className="form-textarea" value={formData.descriptionGlobal} onChange={handleInputChange} placeholder="Texte d'introduction accrocheur..."></textarea>
                        </div>

                        <div style={{ marginTop: '20px' }} >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }} >
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'rgba(255,255,255,0.7)' }} >Sections Supplémentaires</h4>
                                <button type="button" onClick={() => setFormData(p => ({ ...p, extraSections: [...p.extraSections, { title: '', items: [{ type: 'paragraph', content: '' }] }] }))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} >+ Section</button>
                            </div>
                            {formData.extraSections.map((sec, sIdx) => (
                                <div key={sIdx} className="form-section" style={{ background: 'var(--surface-hover)', marginBottom: '15px' }} >
                                    <div className="grid-2" style={{ marginBottom: '10px' }} >
                                        <input type="text" className="form-input" placeholder="Titre de section" value={sec.title} onChange={e => {
                                            const ns = [...formData.extraSections]; ns[sIdx].title = e.target.value; setFormData(p => ({ ...p, extraSections: ns }));
                                        }} />
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, extraSections: p.extraSections.filter((_, i) => i !== sIdx) }))} className="btn btn-danger" style={{ width: '40px', padding: 0 }} >🗑️</button>
                                    </div>
                                    {sec.items.map((item, iIdx) => (
                                        <div key={iIdx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }} >
                                            <select className="form-select" style={{ width: '120px' }} value={item.type} onChange={e => {
                                                const ns = [...formData.extraSections]; ns[sIdx].items[iIdx].type = e.target.value; setFormData(p => ({ ...p, extraSections: ns }));
                                            }} >
                                                <option value="paragraph">Paragraphe</option>
                                                <option value="subtitle">Sous-titre</option>
                                            </select>
                                            <input type="text" className="form-input" value={item.content} onChange={e => {
                                                const ns = [...formData.extraSections]; ns[sIdx].items[iIdx].content = e.target.value; setFormData(p => ({ ...p, extraSections: ns }));
                                            }} />
                                            <button type="button" onClick={() => {
                                                const ns = [...formData.extraSections]; ns[sIdx].items = ns[sIdx].items.filter((_, i) => i !== iIdx); setFormData(p => ({ ...p, extraSections: ns }));
                                            }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} >×</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                        const ns = [...formData.extraSections]; ns[sIdx].items.push({ type: 'paragraph', content: '' }); setFormData(p => ({ ...p, extraSections: ns }));
                                    }} style={{ fontSize: '11px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }} >+ Ajouter un élément</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Traitement...</span>
                                </>
                            ) : (
                                modalType === 'add' ? '✨ Ajouter le Produit' : '💾 Enregistrer les Modifications'
                            )}
                        </button>
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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }} >Cette action est irréversible.</p>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                    <button className="btn" onClick={handleDelete} disabled={submitting} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {submitting ? (
                            <>
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                <span>Suppression...</span>
                            </>
                        ) : (
                            'Oui, Supprimer'
                        )}
                    </button>
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
    const [submitting, setSubmitting] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/orders`)
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
        setSubmitting(true);
        try {
            const url = deleteModal.type === 'all'
                ? `${API_BASE_URL}/api/orders`
                : `${API_BASE_URL}/api/orders/${deleteModal.targetId}`;

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
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setStatusModal(prev => ({ ...prev, targetStatus: newStatus }));
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${statusModal.orderId}/status`, {
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
        } finally {
            setSubmitting(false);
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
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }} >
                <div>
                    <h2 className="admin-title">Gestion des Commandes</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }} >Suivez et traitez les commandes en temps réel</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }} >
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Client, Tel, Statut..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {orders.length > 0 && (
                        <button
                            onClick={() => setDeleteModal({ open: true, type: 'all', targetId: null })}
                            className="btn-premium btn-delete"
                            style={{ height: '45px' }}
                        >
                            <span>🗑️</span> Vider la liste
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
                <div style={{ textAlign: 'center', padding: '10px 0' }} >
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
                    }} >
                        ⚠️
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }} >
                        {deleteModal.type === 'all' ? 'Supprimer toutes les commandes ?' : 'Supprimer cette commande ?'}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }} >
                        {deleteModal.type === 'all'
                            ? 'Cette action supprimera définitivement toutes les commandes de la base de données. Vous ne pourrez pas revenir en arrière.'
                            : 'Voulez-vous vraiment supprimer définitivement cette commande ? Cette opération est irréversible.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }} >
                        <button
                            onClick={() => setDeleteModal({ open: false, type: 'single', targetId: null })}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: '#64748b',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={submitting}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#dc2626',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Suppression...</span>
                                </>
                            ) : (
                                'Oui, supprimer'
                            )}
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
                    <p style={{ marginBottom: '15px' }} >Sélectionnez le nouveau statut pour cette commande :</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >
                        {['En attente', 'Confirmé', 'Expédié', 'Livré', 'Annulé'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                disabled={submitting}
                                className="status-select-btn"
                                style={{
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: status === statusModal.currentStatus ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                    color: status === statusModal.currentStatus ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    opacity: submitting ? 0.7 : 1,
                                    width: '100%'
                                }}
                            >
                                <span>{status}</span>
                                {submitting && statusModal.targetStatus === status ? (
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                ) : (
                                    status === statusModal.currentStatus && <span>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            {filteredOrders.length === 0 ? (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid var(--border)' }} >
                    <div style={{ fontSize: '48px', marginBottom: '20px' }} >📦</div>
                    <p style={{ fontSize: '16px', fontWeight: '500' }} >
                        {orders.length === 0 ? 'Aucune commande pour le moment.' : 'Aucun résultat trouvé pour votre recherche.'}
                    </p>
                </div>
            ) : (
                <div className="orders-list">
                    <div className="order-header-row" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.5fr 1fr 1fr 120px', gap: '20px', padding: '0 24px 12px 24px', opacity: 0.5, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >
                        <div>Détails Produits</div>
                        <div>Client</div>
                        <div>Contact / Date</div>
                        <div>Total</div>
                        <div>Statut</div>
                        <div style={{ textAlign: 'right' }} >Actions</div>
                    </div>
                    {filteredOrders.map(order => (
                        <div key={order._id} className="product-row" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr 1fr 1fr 120px', gap: '20px' }} >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }} >
                                        <div className="product-img-box" style={{ width: '44px', height: '44px' }} >
                                            <img src={item.image} alt="" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }} >{item.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} >
                                                Qté: <span style={{ color: 'var(--primary)', fontWeight: '700' }} >{item.quantity}</span> {item.deviceChoice && <>| <span style={{ color: 'var(--info)' }} >{item.deviceChoice}</span></>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)' }} >{order.userValidation?.name || order.userId?.username || 'Client'}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }} >{order.userId ? 'Membre' : 'Invité'}</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }} >{order.userValidation?.whatsapp || '-'}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }} >{new Date(order.createdAt).toLocaleDateString('fr-FR')}</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '15px' }} >{order.total || order.totalAmount} <span style={{ fontSize: '11px', opacity: 0.7 }} >DT</span></div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }} >{order.paymentMethod === 'whatsapp' ? 'WhatsApp' : order.paymentMethod}</div>
                            </div>
                            <div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    background: order.status === 'Livré' ? 'rgba(16, 185, 129, 0.1)' :
                                        order.status === 'Annulé' ? 'rgba(239, 68, 68, 0.1)' :
                                            order.status === 'Confirmé' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: order.status === 'Livré' ? 'var(--success)' :
                                        order.status === 'Annulé' ? 'var(--danger)' :
                                            order.status === 'Confirmé' ? 'var(--primary)' : 'var(--warning)',
                                    border: '1px solid currentColor'
                                }} >
                                    {order.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} >
                                <button onClick={() => setStatusModal({ open: true, orderId: order._id, currentStatus: order.status })} className="btn-premium btn-edit" title="Statut">
                                    <span>⚙️</span>
                                </button>
                                <button onClick={() => setDeleteModal({ open: true, type: 'single', targetId: order._id })} className="btn-premium btn-delete" title="Supprimer">
                                    <span>🗑️</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

const ClientsManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/users`)
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
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${user._id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            const data = await response.json();
            if (data.success) {
                fetchUsers();
                showNotification(`Rôle de ${user.username} mis à jour avec succès`, 'success');
                setConfirmModal({ open: false, user: null });
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification("Erreur serveur", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Chargement des clients...</div>;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} >
                <div>
                    <h2 className="admin-title">Base Clients</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }} >Gérez les comptes utilisateurs et leurs privilèges</p>
                </div>
            </div>
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
                }} >
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
                    <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '30px', lineHeight: '1.6' }} >
                        Voulez-vous vraiment passer <strong>{confirmModal.user?.username}</strong> en
                        <span style={{
                            fontWeight: 'bold',
                            color: confirmModal.user?.role === 'admin' ? '#3b82f6' : '#ef4444',
                            marginLeft: '5px'
                        }} >
                            {confirmModal.user?.role === 'admin' ? 'client' : 'admin'}
                        </span> ?
                    </p>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }} >
                        <button className="btn btn-secondary" onClick={() => setConfirmModal({ open: false, user: null })} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)' }} >
                            Annuler
                        </button>
                        <button className="btn btn-primary" onClick={handleRoleUpdate} disabled={submitting} style={{ background: 'var(--primary)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }} >
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Traitement...</span>
                                </>
                            ) : (
                                'Confirmer'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="clients-list">
                <div className="order-header-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 120px', gap: '20px', padding: '0 24px 12px 24px', opacity: 0.5, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >
                    <div>Utilisateur</div>
                    <div>Email</div>
                    <div>Inscription</div>
                    <div>Privilèges</div>
                    <div style={{ textAlign: 'right' }} >Actions</div>
                </div>
                {users.map(user => (
                    <div key={user._id} className="product-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 120px', gap: '20px' }} >
                        <td style={{ padding: '0', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }} >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '12px',
                                background: user.role === 'admin' ? 'linear-gradient(45deg, #ef4444, #f87171)' : 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900',
                                boxShadow: user.role === 'admin' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }} >
                                {user.username.substring(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '15px' }} >{user.username}</span>
                        </td>
                        <td style={{ padding: '0', color: 'var(--text-muted)', fontSize: '14px' }} >{user.email}</td>
                        <td style={{ padding: '0', color: 'var(--text-muted)', fontSize: '13px' }} >{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding: '0' }} >
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '10px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: user.role === 'admin' ? 'var(--danger)' : 'var(--primary)',
                                border: '1px solid currentColor'
                            }} >
                                {user.role || 'client'}
                            </span>
                        </td>
                        <td style={{ padding: '0', textAlign: 'right' }} >
                            <button onClick={() => confirmToggleRole(user)} className="btn-premium btn-edit" title="Changer Rôle" style={{ width: 'auto', padding: '8px 12px' }} >
                                <span>🔑</span> Rôle
                            </button>
                        </td>
                    </div>
                ))}
            </div>
        </>
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
        promoCards: [],
        siteLogo: ''
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
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFileUpload = async (e, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                if (type === 'siteLogo') {
                    setHeroData(prev => ({ ...prev, siteLogo: data.imageUrl }));
                } else if (type === 'heroMainImages') {
                    setHeroData(prev => ({ ...prev, heroMainImages: [...prev.heroMainImages, data.imageUrl] }));
                } else if (type === 'heroCardBoxImage') {
                    setHeroData(prev => ({ ...prev, heroCardBoxImage: data.imageUrl }));
                } else if (type === 'heroCardNetflixImage') {
                    setHeroData(prev => ({ ...prev, heroCardNetflixImage: data.imageUrl }));
                } else if (type === 'heroCardGiftImage') {
                    setHeroData(prev => ({ ...prev, heroCardGiftImage: data.imageUrl }));
                } else if (type === 'heroCardSoftImage') {
                    setHeroData(prev => ({ ...prev, heroCardSoftImage: data.imageUrl }));
                } else if (type === 'promoCard') {
                    const newCards = [...heroData.promoCards];
                    newCards[index].image = data.imageUrl;
                    setHeroData(prev => ({ ...prev, promoCards: newCards }));
                } else if (type === 'socialIcon') {
                    const newLinks = [...footerData.socialLinks];
                    newLinks[index].icon = data.imageUrl;
                    setFooterData(prev => ({ ...prev, socialLinks: newLinks }));
                }
                showNotification("Image téléchargée !", "success");
            } else {
                showNotification(data.message || "Erreur de téléchargement", "error");
            }
        } catch (error) {
            console.error(error);
            showNotification("Erreur de connexion", "error");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/settings`)
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
                        promoCards: data.data.promoCards || [],
                        siteLogo: data.data.siteLogo || ''
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
        setSubmitting(true);
        try {
            const body = {
                topStripText,
                topStripMessage,
                ...heroData,
                ...footerData
            };

            const response = await fetch(`${API_BASE_URL}/api/settings`, {
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
        } finally {
            setSubmitting(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} >
                <div>
                    <h2 className="admin-title">Gestion de l'Accueil</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }} >Personnalisez l'apparence et le contenu de votre site</p>
                </div>
                <button
                    disabled={submitting}
                    onClick={handleSave}
                    className="btn-premium btn-edit"
                    style={{ background: 'var(--success)', color: '#fff', height: '45px', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    {submitting ? (
                        <div className="admin-loader-sm" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    ) : (
                        <span>💾</span>
                    )}
                    Enregistrer les modifications
                </button>
            </div>

            <div className="admin-card" style={{ marginBottom: '32px' }} >
                <h3 className="form-section-title"><span>📢</span> Barre Supérieure (Top Strip)</h3>
                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Contact (Gauche)</label>
                        <input type="text" className="form-input" value={topStripText} onChange={(e) => setTopStripText(e.target.value)} placeholder="ex: Contactez-nous sur WhatsApp" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message Promo (Droite)</label>
                        <input type="text" className="form-input" value={topStripMessage} onChange={(e) => setTopStripMessage(e.target.value)} placeholder="ex: Livraison gratuite à partir de 200 DT" />
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '32px' }} >
                <h3 className="form-section-title"><span>🖼️</span> Identité Visuelle (Logo)</h3>
                <div className="form-group">
                    <label className="form-label">URL du Logo</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} >
                        <div style={{ flex: 1, position: 'relative' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL de l'image ou téléchargez..."
                                value={heroData.siteLogo}
                                onChange={(e) => setHeroData({ ...heroData, siteLogo: e.target.value })}
                                style={{ paddingRight: '100px' }}
                            />
                            <input type="file" id="logo-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'siteLogo')} accept="image/*" />
                            <label htmlFor="logo-upload" className="btn-premium btn-edit" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', height: 'auto', padding: '0 15px', fontSize: '12px' }} >
                                {uploading ? '⌛' : 'Choisir...'}
                            </label>
                        </div>
                        <div style={{ width: '120px', height: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px' }} >
                            {heroData.siteLogo ? <img src={heroData.siteLogo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '10px', color: 'var(--text-muted)' }} >AUCUN LOGO</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }} >Bannière Principale (Slider)</h3>
                <div className="form-group">
                    <label className="form-label">Images du Slider Principal (Ajoutez plusieurs URLs ou téléchargez)</label>
                    <MultiInput
                        items={heroData.heroMainImages}
                        onAdd={(val) => addImage('heroMainImages', val)}
                        onRemove={(idx) => removeImage('heroMainImages', idx)}
                        placeholder="URL de l'image"
                        onFileUpload={(e) => handleFileUpload(e, 'heroMainImages')}
                        uploading={uploading}
                    />
                </div>
            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }} >Cartes Secondaires</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} >
                    <div style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)' }} >
                        <label className="form-label">Carte 1 (ex: Box Android)</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL Image"
                                value={heroData.heroCardBoxImage}
                                onChange={(e) => setHeroData({ ...heroData, heroCardBoxImage: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input type="file" id="upload-card-1" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'heroCardBoxImage')} accept="image/*" />
                            <label htmlFor="upload-card-1" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        {heroData.heroCardBoxImage && <img src={heroData.heroCardBoxImage} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardBoxTitle} onChange={e => setHeroData({ ...heroData, heroCardBoxTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardBoxLink} onChange={e => setHeroData({ ...heroData, heroCardBoxLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)' }} >
                        <label className="form-label">Carte 2 (ex: Netflix)</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL Image"
                                value={heroData.heroCardNetflixImage}
                                onChange={(e) => setHeroData({ ...heroData, heroCardNetflixImage: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input type="file" id="upload-card-2" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'heroCardNetflixImage')} accept="image/*" />
                            <label htmlFor="upload-card-2" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        {heroData.heroCardNetflixImage && <img src={heroData.heroCardNetflixImage} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardNetflixTitle} onChange={e => setHeroData({ ...heroData, heroCardNetflixTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardNetflixLink} onChange={e => setHeroData({ ...heroData, heroCardNetflixLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)' }} >
                        <label className="form-label">Carte 3 (ex: Gift Cards)</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL Image"
                                value={heroData.heroCardGiftImage}
                                onChange={(e) => setHeroData({ ...heroData, heroCardGiftImage: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input type="file" id="upload-card-3" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'heroCardGiftImage')} accept="image/*" />
                            <label htmlFor="upload-card-3" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        {heroData.heroCardGiftImage && <img src={heroData.heroCardGiftImage} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardGiftTitle} onChange={e => setHeroData({ ...heroData, heroCardGiftTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardGiftLink} onChange={e => setHeroData({ ...heroData, heroCardGiftLink: e.target.value })} />
                    </div>

                    <div style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)' }} >
                        <label className="form-label">Carte 4 (ex: Software)</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="URL Image"
                                value={heroData.heroCardSoftImage}
                                onChange={(e) => setHeroData({ ...heroData, heroCardSoftImage: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input type="file" id="upload-card-4" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'heroCardSoftImage')} accept="image/*" />
                            <label htmlFor="upload-card-4" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        {heroData.heroCardSoftImage && <img src={heroData.heroCardSoftImage} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                        <textarea className="form-input" placeholder="Titre" value={heroData.heroCardSoftTitle} onChange={e => setHeroData({ ...heroData, heroCardSoftTitle: e.target.value })} style={{ marginBottom: '10px', height: '45px', resize: 'none' }} />
                        <input className="form-input" placeholder="Lien" value={heroData.heroCardSoftLink} onChange={e => setHeroData({ ...heroData, heroCardSoftLink: e.target.value })} />
                    </div>
                </div>

            </div>

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }} >Cartes Promo (Section "Abonnements")</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }} >Ces 3 cartes s'affichent sous le slider principal. Cliquez sur "+" pour en ajouter si nécessaire.</p>

                {heroData.promoCards && heroData.promoCards.map((card, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '15px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }} >
                            <h4 style={{ fontSize: '14px', margin: 0 }} >Carte #{index + 1}</h4>
                            <button onClick={() => removePromoCard(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} >Supprimer</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} >
                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label">Titre (ex: Abonnement Sharing)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={card.title || ''}
                                    onChange={(e) => updatePromoCard(index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label">Image URL</label>
                                <div style={{ display: 'flex', gap: '8px' }} >
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={card.image || ''}
                                        onChange={(e) => updatePromoCard(index, 'image', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <input type="file" id={`upload-promo-${index}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'promoCard', index)} accept="image/*" />
                                    <label htmlFor={`upload-promo-${index}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                        {uploading ? '⌛' : '📁'}
                                    </label>
                                </div>
                                {card.image && <img src={card.image} alt="" style={{ width: '100%', height: '60px', objectFit: 'contain', marginTop: '10px', background: 'var(--surface)', borderRadius: '4px' }} />}
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

            <div className="form-section" style={{ marginBottom: '30px', padding: '20px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#1e293b' }} >Pied de page (Footer)</h3>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} >
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

                <div style={{ marginTop: '20px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                    <h4 style={{ fontSize: '16px', marginBottom: '20px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }} >
                        <span style={{ fontSize: '20px' }}>🌐</span> Réseaux Sociaux Dynamiques (Icônes supplémentaires)
                    </h4>
                    {footerData.socialLinks && footerData.socialLinks.map((link, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }} >
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nom (ex: Instagram)"
                                value={link.name}
                                onChange={(e) => updateSocialLink(idx, 'name', e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="URL Icône"
                                    value={link.icon}
                                    onChange={(e) => updateSocialLink(idx, 'icon', e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input type="file" id={`upload-social-${idx}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'socialIcon', idx)} accept="image/*" />
                                <label htmlFor={`upload-social-${idx}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                                {link.icon && <img src={link.icon} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'var(--surface)' }} />}
                            </div>
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

                <h4 style={{ fontSize: '14px', marginTop: '20px', marginBottom: '10px', color: '#64748b' }} >Colonnes de Liens</h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }} >
                    {/* Column 1 */}
                    <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }} >
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
                    <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }} >
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
                    <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }} >
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

            <button
                className="btn-premium btn-edit"
                disabled={submitting}
                style={{ width: '100%', padding: '18px', fontSize: '16px', marginTop: '40px', background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                onClick={handleSave}
            >
                {submitting ? (
                    <div className="admin-loader-sm" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                ) : (
                    <span>💾</span>
                )}
                Enregistrer Tout
            </button>
        </div>
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
        newKeywords: '',
        newSubcategories: []
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
    const [submitting, setSubmitting] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFileUpload = async (e, mode) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                if (mode === 'edit') {
                    setEditCategoryModal(prev => ({ ...prev, newIcon: data.imageUrl }));
                } else {
                    setNewCategory(prev => ({ ...prev, icon: data.imageUrl }));
                }
                showNotification("Image téléchargée !", "success");
            } else {
                showNotification(data.message || "Erreur de téléchargement", "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setUploading(false);
        }
    };

    const fetchSettings = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/settings`)
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
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewCategory({ name: '', icon: '', title: '', description: '', slug: '', metaTitle: '', metaDescription: '', keywords: '', subcategories: [] });
                fetchCategories();
                showNotification("Catégorie ajoutée", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/categories/${encodeURIComponent(categoryName)}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateCategory = async () => {
        const { oldName, newName, newIcon, newTitle, newDescription, newSlug, newMetaTitle, newMetaDescription, newKeywords, newSubcategories } = editCategoryModal;
        if (!newName.trim()) return;
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/categories/${encodeURIComponent(oldName)}`, {
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
                    newKeywords: newKeywords.trim(),
                    subcategories: newSubcategories
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
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-card">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, item: null })}
                title="Confirmation"
            >
                <div style={{ textAlign: 'center' }} >
                    <p>Supprimer <strong>{confirmModal.item}</strong> ?</p>
                    <div className="modal-actions" style={{ marginTop: '20px' }} >
                        <button className="btn btn-secondary" onClick={() => setConfirmModal({ isOpen: false, item: null })}>Annuler</button>
                        <button className="btn btn-primary" disabled={submitting} style={{ background: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleDeleteCategory(confirmModal.item)}>
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Suppression...</span>
                                </>
                            ) : (
                                'Supprimer'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={editCategoryModal.isOpen}
                onClose={() => setEditCategoryModal({ ...editCategoryModal, isOpen: false })}
                title="Modifier Catégorie"
            >
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
                    <div style={{ display: 'flex', gap: '10px' }} >
                        <div style={{ flex: 1, display: 'flex', gap: '8px' }} >
                            <input className="form-input" value={editCategoryModal.newIcon} onChange={e => setEditCategoryModal({ ...editCategoryModal, newIcon: e.target.value })} placeholder="🔥 أو https://..." />
                            <input type="file" id="edit-cat-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'edit')} accept="image/*" />
                            <label htmlFor="edit-cat-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        <div style={{ width: '42px', height: '42px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }} >
                            {editCategoryModal.newIcon && (editCategoryModal.newIcon.startsWith('http') || editCategoryModal.newIcon.startsWith('/') || editCategoryModal.newIcon.includes('.')) ? (
                                <img src={editCategoryModal.newIcon} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '20px' }} >{editCategoryModal.newIcon || '📁'}</span>
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
                <div style={{ padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px', marginTop: '10px', marginBottom: '15px', border: '1px solid var(--border)' }} >
                    <h4 style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b', fontWeight: '800' }} >PARAMÈTRES SEO</h4>
                    <div className="form-group">
                        <label className="form-label">Meta Nom</label>
                        <input className="form-input" value={editCategoryModal.newMetaTitle} onChange={e => setEditCategoryModal({ ...editCategoryModal, newMetaTitle: e.target.value })} placeholder="Titre pour Google" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Meta Description</label>
                        <textarea className="form-input" style={{ height: '60px' }} value={editCategoryModal.newMetaDescription} onChange={e => setEditCategoryModal({ ...editCategoryModal, newMetaDescription: e.target.value })} placeholder="Description pour Google" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }} >
                        <label className="form-label">Mot Clé</label>
                        <input className="form-input" value={editCategoryModal.newKeywords} onChange={e => setEditCategoryModal({ ...editCategoryModal, newKeywords: e.target.value })} placeholder="Ex: iptv, streaming, abonnement..." />
                    </div>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }} >
                    <label className="form-label" style={{ fontWeight: '800' }} >SOUS-CATÉGORIES</label>
                    <MultiInput
                        items={editCategoryModal.newSubcategories || []}
                        onAdd={(sub) => setEditCategoryModal(prev => ({ ...prev, newSubcategories: [...(prev.newSubcategories || []), sub] }))}
                        onRemove={(idx) => setEditCategoryModal(prev => ({ ...prev, newSubcategories: (prev.newSubcategories || []).filter((_, i) => i !== idx) }))}
                        placeholder="Nom de la sous-catégorie + Entrée"
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }} >
                    <button className="btn" onClick={() => setEditCategoryModal({ ...editCategoryModal, isOpen: false })}>Annuler</button>
                    <button className="btn btn-primary" onClick={handleUpdateCategory} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {submitting ? (
                            <>
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                <span>Mise à jour...</span>
                            </>
                        ) : (
                            'Enregistrer'
                        )}
                    </button>
                </div>
            </Modal>

            <h2>Gestion des Catégories</h2>

            <form onSubmit={handleAddCategory} className="form-inline" style={{ background: 'var(--surface-hover)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }} >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', marginBottom: '15px' }} >
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
                    <div style={{ display: 'flex', gap: '8px' }} >
                        <div style={{ flex: 1, display: 'flex', gap: '8px' }} >
                            <input className="form-input" placeholder="Icône (Emoji/URL)" value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                            <input type="file" id="new-cat-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'new')} accept="image/*" />
                            <label htmlFor="new-cat-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        <div style={{ width: '42px', height: '42px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }} >
                            {newCategory.icon && (newCategory.icon.startsWith('http') || newCategory.icon.startsWith('/') || newCategory.icon.includes('.')) ? (
                                <img src={newCategory.icon} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '20px' }} >{newCategory.icon || '📁'}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', marginBottom: '15px' }} >
                    <input className="form-input" placeholder="Titre SEO (Page)" value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} />
                    <input className="form-input" placeholder="Description courte (Page)" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr auto', gap: '15px', padding: '15px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                    <input className="form-input" placeholder="Meta Nom SEO" value={newCategory.metaTitle} onChange={e => setNewCategory({ ...newCategory, metaTitle: e.target.value })} />
                    <input className="form-input" placeholder="Meta Description SEO" value={newCategory.metaDescription} onChange={e => setNewCategory({ ...newCategory, metaDescription: e.target.value })} />
                    <input className="form-input" placeholder="Mot Clé SEO" value={newCategory.keywords} onChange={e => setNewCategory({ ...newCategory, keywords: e.target.value })} />
                </div>
                <div style={{ marginTop: '15px', padding: '15px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }} >
                    <label className="form-label" style={{ fontWeight: '800' }} >SOUS-CATÉGORIES</label>
                    <MultiInput
                        items={newCategory.subcategories || []}
                        onAdd={(sub) => setNewCategory(prev => ({ ...prev, subcategories: [...(prev.subcategories || []), sub] }))}
                        onRemove={(idx) => setNewCategory(prev => ({ ...prev, subcategories: (prev.subcategories || []).filter((_, i) => i !== idx) }))}
                        placeholder="Ajouter une sous-catégorie (ex: Netflix, Premium...) + Entrée"
                    />
                </div>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }} >
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '10px 30px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                        {submitting ? (
                            <>
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                <span>Ajout...</span>
                            </>
                        ) : (
                            'Ajouter la catégorie'
                        )}
                    </button>
                </div>
            </form>

            <div style={{ display: 'grid', gap: '15px' }} >
                {settings.categories && settings.categories.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }} >
                                {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/') || cat.icon.includes('.')) ? (
                                    <img src={cat.icon} alt={cat.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ fontSize: '20px' }} >{cat.icon || '📁'}</span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }} >{cat.name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }} >Slug: {cat.slug} | {cat.title}</div>
                                {cat.subcategories && cat.subcategories.length > 0 && (
                                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }} >
                                        {cat.subcategories.map((sub, i) => (
                                            <span key={i} style={{ fontSize: '9px', background: '#eff6ff', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #dbeafe' }} >{sub}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }} >
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
                                newKeywords: cat.keywords || '',
                                newSubcategories: cat.subcategories || []
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
    const [settings, setSettings] = useState({ paymentModes: [], deviceChoices: [], categories: [], resolutions: [], regions: [], bouquets: [], subscriptionFormats: [] });
    const [newMode, setNewMode] = useState({ name: '', logo: '' });
    const [newChoice, setNewChoice] = useState('');
    const [newResolution, setNewResolution] = useState({ name: '', image: '' });
    const [newRegion, setNewRegion] = useState({ name: '', image: '' });
    const [newBouquet, setNewBouquet] = useState({ name: '', image: '' });
    const [newSubscriptionFormat, setNewSubscriptionFormat] = useState({ name: '', image: '' });

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null, type: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleFileUpload = async (e, mode) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                switch (mode) {
                    case 'payment': setNewMode(prev => ({ ...prev, logo: data.imageUrl })); break;
                    case 'resolution': setNewResolution(prev => ({ ...prev, image: data.imageUrl })); break;
                    case 'region': setNewRegion(prev => ({ ...prev, image: data.imageUrl })); break;
                    case 'bouquet': setNewBouquet(prev => ({ ...prev, image: data.imageUrl })); break;
                    case 'format': setNewSubscriptionFormat(prev => ({ ...prev, image: data.imageUrl })); break;
                }
                showNotification("Image téléchargée !", "success");
            } else {
                showNotification(data.message || "Erreur", "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setUploading(false);
        }
    };

    const openConfirmModal = (item, type) => {
        setConfirmModal({ isOpen: true, item, type });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, item: null, type: '' });
    };

    const handleDeleteConfirm = () => {
        if (confirmModal.type === 'paymentMode') handleDeleteMode(confirmModal.item);
        else if (confirmModal.type === 'deviceChoice') handleDeleteChoice(confirmModal.item);
        else if (confirmModal.type === 'resolution') handleDeleteResolution(confirmModal.item);
        else if (confirmModal.type === 'region') handleDeleteRegion(confirmModal.item);
        else if (confirmModal.type === 'bouquet') handleDeleteBouquet(confirmModal.item);
        else if (confirmModal.type === 'subscriptionFormat') handleDeleteSubscriptionFormat(confirmModal.item);
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const fetchSettings = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/settings`)
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
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/payment-modes`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMode = async (mode) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/payment-modes/${encodeURIComponent(mode)}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddChoice = async (e) => {
        e.preventDefault();
        if (!newChoice.trim()) return;
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/device-choices`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteChoice = async (choice) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/device-choices/${encodeURIComponent(choice)}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddResolution = async (e) => {
        e.preventDefault();
        if (!newResolution.name.trim()) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/resolutions`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteResolution = async (name) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/resolutions/${encodeURIComponent(name)}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddRegion = async (e) => {
        e.preventDefault();
        if (!newRegion.name.trim()) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/regions`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRegion = async (name) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/regions/${encodeURIComponent(name)}`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddBouquet = async (e) => {
        e.preventDefault();
        if (!newBouquet.name.trim()) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/bouquets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBouquet.name.trim(), image: newBouquet.image.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewBouquet({ name: '', image: '' });
                showNotification("Bouquet ajouté", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBouquet = async (name) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/bouquets/${encodeURIComponent(name)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Bouquet supprimé", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddSubscriptionFormat = async (e) => {
        e.preventDefault();
        if (!newSubscriptionFormat.name.trim()) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/subscription-formats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubscriptionFormat.name.trim(), image: newSubscriptionFormat.image.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                setNewSubscriptionFormat({ name: '', image: '' });
                showNotification("Format ajouté", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubscriptionFormat = async (name) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings/subscription-formats/${encodeURIComponent(name)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
                showNotification("Format supprimé", "success");
                closeConfirmModal();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Chargement des réglages...</div>;

    return (
        <div className="admin-card">
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                title="Confirmation de suppression"
            >
                <div style={{ textAlign: 'center' }} >
                    <p style={{ marginBottom: '25px', color: 'var(--text-main)' }} >Supprimer <strong>{confirmModal.item}</strong> ? Cette action est irréversible.</p>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={closeConfirmModal}>Annuler</button>
                        <button
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ background: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => {
                                if (confirmModal.type === 'paymentMode') handleDeleteMode(confirmModal.item);
                                else if (confirmModal.type === 'deviceChoice') handleDeleteChoice(confirmModal.item);
                                else if (confirmModal.type === 'resolution') handleDeleteResolution(confirmModal.item);
                                else if (confirmModal.type === 'region') handleDeleteRegion(confirmModal.item);
                                else if (confirmModal.type === 'bouquet') handleDeleteBouquet(confirmModal.item);
                                else if (confirmModal.type === 'subscriptionFormat') handleDeleteSubscriptionFormat(confirmModal.item);
                            }}
                        >
                            {submitting ? (
                                <>
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Suppression...</span>
                                </>
                            ) : (
                                'Supprimer Definitivement'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
            <h2>Détails Généraux</h2>
            <p className="text-muted">Gérez les configurations globales du site.</p>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div style={{ marginTop: '20px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '10px', fontWeight: '700' }} >Identifiants Administrateur</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }} >Ces identifiants sont utilisés pour accéder à cet espace d'administration.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }} >
                    <div className="form-group" style={{ marginBottom: 0 }} >
                        <label className="form-label">Email Admin</label>
                        <input
                            type="email"
                            value={settings.adminEmail || ''}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }} >
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

            <div style={{ marginTop: '20px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '10px', fontWeight: '700' }} >Configuration Email (Envoi de codes)</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }} >Ces identifiants sont utilisés pour envoyer les codes de réinitialisation de mot de passe (Gmail App Password requis).</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }} >
                    <div className="form-group" style={{ marginBottom: 0 }} >
                        <label className="form-label">Email Expéditeur</label>
                        <input
                            type="email"
                            value={settings.senderEmail || ''}
                            onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                            className="form-input"
                            placeholder="ex: kmejri57@gmail.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }} >
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
                        disabled={submitting}
                        onClick={async () => {
                            setSubmitting(true);
                            try {
                                const res = await fetch(`${API_BASE_URL}/api/settings`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        adminEmail: settings.adminEmail,
                                        adminPassword: settings.adminPassword,
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
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        className="btn btn-primary"
                        style={{ height: '42px', background: '#10b981', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {submitting ? (
                            <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                        ) : null}
                        Mettre à jour
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '10px', fontWeight: '700' }} >Configuration Email notification</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }} >Ces identifiants sont utilisés pour envoyer les notifications de commande (Gmail App Password requis).</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }} >
                    <div className="form-group" style={{ marginBottom: 0 }} >
                        <label className="form-label">Email Expéditeur</label>
                        <input
                            type="email"
                            value={settings.notificationSenderEmail || ''}
                            onChange={(e) => setSettings({ ...settings, notificationSenderEmail: e.target.value })}
                            className="form-input"
                            placeholder="ex: kmejri57@gmail.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }} >
                        <label className="form-label">Mot de passe d'application</label>
                        <input
                            type="text"
                            value={settings.notificationSenderPassword || ''}
                            onChange={(e) => setSettings({ ...settings, notificationSenderPassword: e.target.value })}
                            className="form-input"
                            placeholder="ex: msacmuasnjmnszxp"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }} >
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
                        disabled={submitting}
                        onClick={async () => {
                            setSubmitting(true);
                            try {
                                const res = await fetch(`${API_BASE_URL}/api/settings`, {
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
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        className="btn btn-primary"
                        style={{ height: '42px', background: '#10b981', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {submitting ? (
                            <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                        ) : null}
                        Mettre à jour
                    </button>
                </div>
            </div >


            <div style={{ marginTop: '20px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '10px', fontWeight: '700' }} >Configuration WhatsApp</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }} >Ce numéro sera utilisé pour recevoir les commandes par message.</p>
                <div style={{ display: 'flex', gap: '20px' }} >
                    <div style={{ flex: 1 }} >
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
                                const res = await fetch(`${API_BASE_URL}/api/settings`, {
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
            </div >
            <div style={{ marginTop: '30px', padding: '25px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} >
                <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '10px', fontWeight: '700' }} >Couleur du Titre Produit</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }} >Modifiez la couleur du titre dans la page de détails du produit.</p>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} >
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
                                const res = await fetch(`${API_BASE_URL}/api/settings`, {
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
            < div style={{ marginTop: '30px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Gestion des Résolutions</h3>

                <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                    <form onSubmit={handleAddResolution} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }} >
                        <div style={{ flex: 1 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Nom de la résolution</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: 4K, FHD"
                                value={newResolution.name}
                                onChange={(e) => setNewResolution({ ...newResolution, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Icône/Image</label>
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="URL ou téléchargez"
                                    value={newResolution.image}
                                    onChange={(e) => setNewResolution({ ...newResolution, image: e.target.value })}
                                    style={{ borderRadius: '8px', flex: 1 }}
                                />
                                <input type="file" id="res-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'resolution')} accept="image/*" />
                                <label htmlFor="res-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '42px', borderRadius: '8px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                            {submitting ? (<div className="admin-loader-sm" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>) : null} Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }} >
                    {settings.resolutions && settings.resolutions.map((res, index) => (
                        <div key={index} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }} >
                            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--surface-hover)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                {res.image ? <img src={res.image} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }} >📺</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }} >{res.name}</span>
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
            <div style={{ marginTop: '30px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Gestion des Régions</h3>

                <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                    <form onSubmit={handleAddRegion} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }} >
                        <div style={{ flex: 1 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Nom de la région</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: Europe, Monde, USA"
                                value={newRegion.name}
                                onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Icône/Image</label>
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="URL ou téléchargez"
                                    value={newRegion.image}
                                    onChange={(e) => setNewRegion({ ...newRegion, image: e.target.value })}
                                    style={{ borderRadius: '8px', flex: 1 }}
                                />
                                <input type="file" id="region-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'region')} accept="image/*" />
                                <label htmlFor="region-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '42px', borderRadius: '8px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                            {submitting ? (<div className="admin-loader-sm" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>) : null} Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }} >
                    {settings.regions && settings.regions.map((reg, index) => (
                        <div key={index} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }} >
                            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--surface-hover)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                {reg.image ? <img src={reg.image} alt={reg.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }} >🌍</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }} >{reg.name}</span>
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

            {/* Bouquets Management */}
            <div style={{ marginTop: '30px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Gestion des Bouquets</h3>

                <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                    <form onSubmit={handleAddBouquet} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }} >
                        <div style={{ flex: 1 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Nom du bouquet</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: Sports, Cinéma, Kids"
                                value={newBouquet.name}
                                onChange={(e) => setNewBouquet({ ...newBouquet, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Icône/Image</label>
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="URL ou téléchargez"
                                    value={newBouquet.image}
                                    onChange={(e) => setNewBouquet({ ...newBouquet, image: e.target.value })}
                                    style={{ borderRadius: '8px', flex: 1 }}
                                />
                                <input type="file" id="bouquet-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'bouquet')} accept="image/*" />
                                <label htmlFor="bouquet-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '42px', borderRadius: '8px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                            {submitting ? (<div className="admin-loader-sm" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>) : null} Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }} >
                    {settings.bouquets && settings.bouquets.map((bouquet, index) => (
                        <div key={index} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }} >
                            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--surface-hover)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                {bouquet.image ? <img src={bouquet.image} alt={bouquet.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }} >📦</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }} >{bouquet.name}</span>
                            <button
                                onClick={() => openConfirmModal(bouquet.name, 'bouquet')}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscription Formats Management */}
            <div style={{ marginTop: '30px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Gestion de Format de l'Abonnement</h3>

                <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                    <form onSubmit={handleAddSubscriptionFormat} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }} >
                        <div style={{ flex: 1 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Nom du format</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ex: 12 Mois, 6 Mois"
                                value={newSubscriptionFormat.name}
                                onChange={(e) => setNewSubscriptionFormat({ ...newSubscriptionFormat, name: e.target.value })}
                                style={{ borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 2 }} >
                            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px' }} >Icône/Image</label>
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="URL ou téléchargez"
                                    value={newSubscriptionFormat.image}
                                    onChange={(e) => setNewSubscriptionFormat({ ...newSubscriptionFormat, image: e.target.value })}
                                    style={{ borderRadius: '8px', flex: 1 }}
                                />
                                <input type="file" id="format-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'format')} accept="image/*" />
                                <label htmlFor="format-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '42px', borderRadius: '8px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }} >
                            {submitting ? (<div className="admin-loader-sm" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>) : null} Ajouter
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }} >
                    {settings.subscriptionFormats && settings.subscriptionFormats.map((format, index) => (
                        <div key={index} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }} >
                            <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--surface-hover)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                {format.image ? <img src={format.image} alt={format.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }} >📅</span>}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }} >{format.name}</span>
                            <button
                                onClick={() => openConfirmModal(format.name, 'subscriptionFormat')}
                                style={{ position: 'absolute', top: '8px', right: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '30px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Modes de Paiement</h3>

                <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '15px' }} >Ajouter un nouveau mode</h4>
                    <form onSubmit={handleAddMode} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }} >
                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <label className="form-label" style={{ fontSize: '12px' }} >Nom du mode</label>
                            <input
                                type="text"
                                value={newMode.name}
                                onChange={(e) => setNewMode({ ...newMode, name: e.target.value })}
                                placeholder="ex: D17, Flouci, Sobflous"
                                className="form-input"
                                style={{ height: '45px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <label className="form-label" style={{ fontSize: '12px' }} >Logo / Télécharger</label>
                            <div style={{ display: 'flex', gap: '8px' }} >
                                <input
                                    type="text"
                                    value={newMode.logo}
                                    onChange={(e) => setNewMode({ ...newMode, logo: e.target.value })}
                                    placeholder="URL ou téléchargez"
                                    className="form-input"
                                    style={{ height: '45px', flex: 1 }}
                                />
                                <input type="file" id="payment-upload" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'payment')} accept="image/*" />
                                <label htmlFor="payment-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer', height: '45px' }} >
                                    {uploading ? '⌛' : '📁'}
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ height: '45px', padding: '0 25px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }} >
                            {submitting ? (
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }} ><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            )}
                            Ajouter
                        </button>
                    </form>
                </div>


                <div className="payment-modes-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }} >
                    {settings.paymentModes && settings.paymentModes.map((mode, index) => (
                        <div key={index} className="payment-mode-admin-card" style={{
                            background: 'var(--surface)',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }} >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--surface-hover)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #f1f5f9',
                                    padding: '8px'
                                }} >
                                    {mode.logo ? (
                                        <img src={mode.logo} alt={mode.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ fontSize: '20px' }} >💳</div>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '700', color: '#1e293b', display: 'block', fontSize: '14px' }} >{mode.name}</span>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }} >{mode.logo ? 'Logo avec lien' : 'Sans logo'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => openConfirmModal(mode.name, 'paymentMode')}
                                style={{
                                    background: 'var(--surface)',
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
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'var(--surface-hover)', borderRadius: '16px', border: '1px dashed #e2e8f0', color: '#94a3b8', fontStyle: 'italic' }} >
                            Aucun mode de paiement défini. Ajoutez-en un ci-dessus.
                        </div>
                    )}
                </div>

            </div>

            <div style={{ marginTop: '50px' }} >
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)' }} >Choix d'appareil (IPTV)</h3>

                <form onSubmit={handleAddChoice} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }} >
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

                <div className="device-choices-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} >
                    {settings.deviceChoices && settings.deviceChoices.map((choice, index) => (
                        <div key={index} style={{
                            background: 'var(--surface)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500',
                            color: 'var(--text-main)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }} >
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
                        <div style={{ color: '#94a3b8', fontStyle: 'italic' }} >Aucun choix d'appareil défini. Ajoutez-en un ci-dessus.</div>
                    )}
                </div>
            </div>

            {/* Anti Clic-Droit Setting */}
            <div style={{ marginTop: '50px', padding: '25px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <div>
                        <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '8px' }} >Sécurité : Anti Clic-Droit</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }} >Désactiver le menu contextuel (clic droit) sur tout le site pour protéger votre contenu.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                        <div
                            onClick={async () => {
                                try {
                                    const newValue = !settings.disableRightClick;
                                    setSettings({ ...settings, disableRightClick: newValue });
                                    const res = await fetch(`${API_BASE_URL}/api/settings`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ disableRightClick: newValue })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        showNotification(`Anti Clic-Droit ${newValue ? 'activé' : 'désactivé'}`, "success");
                                    }
                                } catch (err) {
                                    showNotification("Erreur lors de la mise à jour", "error");
                                }
                            }}
                            style={{
                                width: '50px',
                                height: '26px',
                                background: settings.disableRightClick ? '#10b981' : '#cbd5e1',
                                borderRadius: '13px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: 'var(--surface)',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '3px',
                                left: settings.disableRightClick ? '27px' : '3px',
                                transition: 'left 0.3s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                        <span style={{ fontWeight: 'bold', color: settings.disableRightClick ? '#10b981' : '#64748b', fontSize: '14px', minWidth: '80px' }} >
                            {settings.disableRightClick ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
};

const GuidesManager = ({ openGlobalSeo }) => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);
    const [newGuide, setNewGuide] = useState({
        title: '',
        intro: '',
        content: '',
        excerpt: '',
        image: '',
        category: "Guides d'installation",
        sections: [],
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        titleFontSize: '2.2rem',
        contentFontSize: '1.1rem'
    });
    const [uploading, setUploading] = useState(false);
    const [introIsHtml, setIntroIsHtml] = useState(false);
    const toggleIntroMode = () => setIntroIsHtml(!introIsHtml);
    const [submitting, setSubmitting] = useState(false);

    const [pageSettings, setPageSettings] = useState({
        guideHeroImage: '',
        guidePageBgImage: ''
    });

    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [linkGenerator, setLinkGenerator] = useState({ type: 'product', id: '', customTitle: '', customUrl: '' });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setNewGuide({ ...newGuide, image: data.imageUrl });
                showNotification("Image téléchargée", "success");
            }
        } catch (error) {
            showNotification("Erreur d'upload", "error");
        } finally {
            setUploading(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchOtherData = async () => {
        try {
            const [pRes, sRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/products`),
                fetch(`${API_BASE_URL}/api/settings`)
            ]);
            const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
            if (pData.success) setAvailableProducts(pData.data);
            if (sData.success && sData.data.categories) setAvailableCategories(sData.data.categories);
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
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchGuides();
        fetchOtherData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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
                setNewGuide({
                    title: '', intro: '', content: '', excerpt: '', image: '',
                    category: "Guides d'installation", sections: [],
                    metaTitle: '', metaDescription: '', keywords: '',
                    titleFontSize: '2.2rem', contentFontSize: '1.1rem'
                });
                fetchGuides();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/guides/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification("Article supprimé", "success");
                fetchGuides();
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const addSection = () => {
        setNewGuide({
            ...newGuide,
            sections: [...newGuide.sections, { title: '', content: '', image: '', titleFontSize: '1.5rem', contentFontSize: '1.1rem' }]
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
            intro: guide.intro || '',
            content: guide.content,
            excerpt: guide.excerpt || '',
            image: guide.image || '',
            category: guide.category || "Guides d'installation",
            sections: guide.sections || [],
            metaTitle: guide.metaTitle || '',
            metaDescription: guide.metaDescription || '',
            keywords: guide.keywords || '',
            titleFontSize: guide.titleFontSize || '2.2rem',
            contentFontSize: guide.contentFontSize || '1.1rem'
        });
        setIsModalOpen(true);
    };

    const filteredGuides = guides.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '15px' }} >
            <div className="admin-spinner"></div>
            <p style={{ color: '#64748b', fontSize: '14px' }} >Chargement des guides...</p>
        </div>
    );

    return (
        <div className="admin-view-container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
            }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                    }}
                    >
                        <IconGuide />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }} >Gestion des Guides</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }} >{guides.length} articles publiés à ce jour</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }} >
                    <button
                        onClick={openGlobalSeo}
                        className="btn-premium btn-edit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            fontWeight: '600',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <IconSEO /> Configurer SEO
                    </button>
                    <button
                        className="btn-premium"
                        onClick={() => { setEditingGuide(null); setIsModalOpen(true); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            fontWeight: '700',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            color: '#fff',
                            border: 'none'
                        }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Nouvel Article
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'start' }} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} >
                    {/* Search & Bulk Actions */}
                    <div style={{
                        background: 'var(--surface)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                    >
                        <div style={{ position: 'relative', flex: 1 }} >
                            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Rechercher par titre ou contenu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '40px', marginBottom: 0, borderRadius: '10px' }}
                            />
                        </div>
                    </div>

                    {/* Guides List Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }} >
                        {filteredGuides.length > 0 ? filteredGuides.map(guide => (
                            <div key={guide._id} style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                backdropFilter: 'blur(10px)'
                            }} className="guide-admin-card">
                                <div style={{ height: '160px', position: 'relative' }} >
                                    <img
                                        src={guide.image || "https://premium.Satpromax.com/wp-content/uploads/2024/09/Logo-sat-PRO-MAX-site-e1726059632832.png"}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                    >
                                        {new Date(guide.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ padding: '20px' }} >
                                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '8px', lineHeight: '1.4' }} >{guide.title}</h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.5)',
                                        margin: '0 0 20px 0',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.6'
                                    }}
                                    >
                                        {guide.excerpt || "Aucun extrait disponible pour cet article..."}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }} >
                                        <button
                                            className="btn"
                                            onClick={() => handleEdit(guide)}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                background: '#f1f5f9',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => handleDelete(guide._id)}
                                            style={{
                                                padding: '8px 12px',
                                                background: '#fff1f2',
                                                color: '#f43f5e',
                                                fontWeight: '600',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: '16px', border: '1px dashed #e2e8f0' }} >
                                <p style={{ color: '#94a3b8', fontSize: '15px' }} >Aucun guide trouvé correspondant à votre recherche.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div style={{
                    background: 'var(--surface)',
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f1f5f9',
                    position: 'sticky',
                    top: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Apparence Page
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} >
                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <label className="form-label" style={{ fontWeight: '700', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} >Image Hero Desktop</label>
                            <input
                                type="text"
                                className="form-input"
                                value={pageSettings.guideHeroImage}
                                onChange={(e) => setPageSettings({ ...pageSettings, guideHeroImage: e.target.value })}
                                placeholder="URL de l'image"
                                style={{ borderRadius: '10px', fontSize: '13px' }}
                            />
                            {pageSettings.guideHeroImage && (
                                <img src={pageSettings.guideHeroImage} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--border)' }} alt="Preview" />
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <label className="form-label" style={{ fontWeight: '700', fontSize: '12px', color: '#c1c3c5ffff', textTransform: 'uppercase', letterSpacing: '0.05em' }} >Fond de Page</label>
                            <input
                                type="text"
                                className="form-input"
                                value={pageSettings.guidePageBgImage}
                                onChange={(e) => setPageSettings({ ...pageSettings, guidePageBgImage: e.target.value })}
                                placeholder="URL du fond"
                                style={{ borderRadius: '10px', fontSize: '13px' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                background: '#1e293b',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onClick={handleSavePageSettings}
                        >
                            {submitting ? (
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                            ) : null}
                            Enregistrer Modifications
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingGuide ? "Modifier l'Article" : "Nouvel Article"}
            >
                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }} >
                    {/* Main Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} >
                        <div style={{ display: 'flex', gap: '15px' }} >
                            <div style={{ flex: 1 }} >
                                <label className="form-label" style={{ fontWeight: '700' }} >Titre de l'article *</label>
                                <input
                                    className="form-input"
                                    value={newGuide.title}
                                    onChange={e => setNewGuide({ ...newGuide, title: e.target.value })}
                                    placeholder="Ex: Guide d'installation IPTV sur Android"
                                    required
                                    style={{ height: '50px', fontSize: '16px', borderRadius: '12px' }}
                                />
                            </div>
                            <div style={{ width: '120px' }} >
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '11px' }} >TAILLE TITRE</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newGuide.titleFontSize}
                                    onChange={e => setNewGuide({ ...newGuide, titleFontSize: e.target.value })}
                                    placeholder="2.2rem"
                                    style={{ height: '50px', borderRadius: '12px', textAlign: 'center' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <label className="form-label" style={{ fontWeight: '700' }} >Introduction (Format texte brut)</label>
                                <button type="button" className="btn btn-secondary" onClick={toggleIntroMode} style={{ fontSize: '10px', padding: '4px 8px' }} >
                                    Basculer vers {introIsHtml ? "Texte Brut" : "HTML"}
                                </button>
                            </div>
                            <textarea
                                className="form-input"
                                style={{ height: '100px', borderRadius: '12px', lineHeight: '1.6' }}
                                value={newGuide.intro}
                                onChange={e => setNewGuide({ ...newGuide, intro: e.target.value })}
                                placeholder="Introduction s'affichant en haut de l'article..."
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }} >
                            <label className="form-label" style={{ fontWeight: '700' }} >Corps de l'Article (HTML) *</label>
                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }} >Utilisez des balises HTML standards pour la mise en forme.</p>
                            <textarea
                                className="form-input"
                                style={{ height: '400px', fontFamily: 'monospace', borderRadius: '12px', background: '#f8fafc', color: '#334155' }}
                                value={newGuide.content}
                                onChange={e => setNewGuide({ ...newGuide, content: e.target.value })}
                                placeholder="<p>...</p>\n<h2>...</h2>..."
                                required
                            />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} >
                        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }} >
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b', fontWeight: '800' }} >RÉGLAGES PUBLICATION</h4>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '12px' }} >IMAGE À LA UNE</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }} >
                                    <input className="form-input" value={newGuide.image} onChange={e => setNewGuide({ ...newGuide, image: e.target.value })} placeholder="URL Image" />
                                    <input type="file" id="guide-img" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    <label htmlFor="guide-img" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                        {uploading ? '⌛' : '📁'}
                                    </label>
                                </div>
                                <div style={{ width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} >
                                    {newGuide.image ? (
                                        <img src={newGuide.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <svg width="48" height="48" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '12px' }} >RÉSUMÉ (EXCERPT)</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: '100px', borderRadius: '10px' }}
                                    value={newGuide.excerpt}
                                    onChange={e => setNewGuide({ ...newGuide, excerpt: e.target.value })}
                                    placeholder="Court résumé s'affichant sur la liste des guides..."
                                />
                            </div>
                        </div>

                        {/* Link Generator */}
                        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '24px', borderRadius: '20px', color: '#fff' }} >
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }} >
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                GÉNÉRATEUR DE LIENS
                            </h4>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }} >Générez des liens stylés à insérer dans vos textes.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} >
                                <input
                                    className="form-input"
                                    placeholder="Texte du lien..."
                                    value={linkGenerator.customTitle}
                                    onChange={e => setLinkGenerator({ ...linkGenerator, customTitle: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }}
                                />
                                <input
                                    className="form-input"
                                    placeholder="Lien (URL)..."
                                    value={linkGenerator.customUrl}
                                    onChange={e => setLinkGenerator({ ...linkGenerator, customUrl: e.target.value })}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const text = linkGenerator.customTitle || "Cliquez ici";
                                        const url = linkGenerator.customUrl;
                                        if (!url) return showNotification("Saisissez une URL", "error");
                                        const html = `<a href="${url}" style="color: #6366f1; font-weight: 700; text-decoration: underline;">${text}</a>`;
                                        navigator.clipboard.writeText(html);
                                        showNotification("HTML Copié !", "success");
                                    }}
                                    style={{ background: 'var(--surface)', color: '#1e293b', fontWeight: '800' }}
                                >
                                    Copier le Code HTML
                                </button>
                            </div>
                        </div>

                        {/* SEO Card */}
                        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }} >
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b', fontWeight: '800' }} >SEO ARTICLE</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} >
                                <div className="form-group" style={{ marginBottom: 0 }} >
                                    <label className="form-label" style={{ fontSize: '11px', fontWeight: '700' }} >META TITLE</label>
                                    <input className="form-input" value={newGuide.metaTitle} onChange={e => setNewGuide({ ...newGuide, metaTitle: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }} >
                                    <label className="form-label" style={{ fontSize: '11px', fontWeight: '700' }} >META DESCRIPTION</label>
                                    <textarea className="form-input" style={{ height: '80px' }} value={newGuide.metaDescription} onChange={e => setNewGuide({ ...newGuide, metaDescription: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ paddingTop: '20px' }} >
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                                style={{ flex: 2, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {submitting ? (
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                ) : null}
                                Enregistrer l'Article
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Reviews Manager Component
const ReviewsManager = ({ openGlobalSeo }) => {
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
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${id}/status`, {
                method: 'PATCH',
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
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
                marginBottom: '30px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '25px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
            }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} >
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        padding: '12px',
                        borderRadius: '14px',
                        color: '#fff',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                    }}
                    >
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px' }} >Gestion des Commentaires</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }} >Gérez et modérez les avis de vos clients</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                    <button
                        onClick={openGlobalSeo}
                        className="btn-premium btn-edit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff'
                        }}
                    >
                        <IconSEO /> SEO
                    </button>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }} >
                        Total: <span style={{ color: '#3b82f6' }}>{reviews.length}</span>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-premium"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700'
                        }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Ajouter un avis
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }} >Chargement des commentaires...</div>
            ) : (
                <div className="table-container" style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}
                >
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.03)' }} >
                            <tr>
                                <th style={{ padding: '18px 25px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Utilisateur</th>
                                <th style={{ padding: '18px 25px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Commentaire</th>
                                <th style={{ padding: '18px 25px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Note</th>
                                <th style={{ padding: '18px 25px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Statut</th>
                                <th style={{ padding: '18px 25px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Date</th>
                                <th style={{ padding: '18px 25px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }} >Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.3s' }} className="table-row-hover">
                                    <td style={{ padding: '20px 25px' }} >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                color: '#3b82f6',
                                                border: '1px solid rgba(59, 130, 246, 0.2)'
                                            }} >
                                                {review.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }} >{review.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }} >
                                        <p style={{ maxWidth: '350px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.6' }} title={review.comment}>{review.comment}</p>
                                    </td>
                                    <td style={{ padding: '20px 25px' }} >
                                        <div style={{ display: 'flex', gap: '2px' }} >
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{ color: i < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)', fontSize: '16px' }} >★</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }} >
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            background: review.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: review.status === 'approved' ? '#10b981' : '#f59e0b',
                                            border: `1px solid ${review.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                        }} >
                                            {review.status === 'approved' ? '● Approuvé' : '● En attente'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 25px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }} >{new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '20px 25px' }} >
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }} >
                                            {review.status === 'pending' && (
                                                <button
                                                    disabled={submitting}
                                                    onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '12px',
                                                        background: 'rgba(16, 185, 129, 0.15)',
                                                        color: '#10b981',
                                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '700',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                    onMouseOver={(e) => { if(!submitting) { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff' } }}
                                                    onMouseOut={(e) => { if(!submitting) { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; e.currentTarget.style.color = '#10b981' } }}
                                                >
                                                    {submitting ? <div className="admin-loader-sm" style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> : null}
                                                    Approuver
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: '12px',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '700',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
                                            >
                                                Supprimer
                                            </button>
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
                }} >
                    <div style={{
                        background: 'var(--surface)',
                        padding: '30px',
                        borderRadius: '20px',
                        width: '90%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        animation: 'modalFadeUp 0.3s ease-out'
                    }}
                    >
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
                        }}
                        >
                            <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }} >Confirmation de suppression</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }} >Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.</p>
                        <div style={{ display: 'flex', gap: '12px' }} >
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-hover)', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Annuler
                            </button>
                            <button
                                disabled={submitting}
                                onClick={confirmDelete}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {submitting ? <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> : null}
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
                }} >
                    <div style={{
                        background: 'var(--surface)',
                        padding: '35px',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'modalFadeUp 0.3s ease-out'
                    }}
                    >
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '25px', textAlign: 'center' }} >Ajouter un nouvel avis</h2>

                        <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} >
                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }} >Nom d'utilisateur</label>
                                <input
                                    className="form-input"
                                    value={newReviewForm.username}
                                    onChange={e => setNewReviewForm({ ...newReviewForm, username: e.target.value })}
                                    placeholder="Ex: Ahmed Ben Salem"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }} >Note (Étoiles)</label>
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

                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }} >Commentaire</label>
                                <textarea
                                    className="form-input"
                                    style={{ height: '100px', padding: '12px' }}
                                    value={newReviewForm.comment}
                                    onChange={e => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                                    placeholder="Rédigez l'avis ici..."
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }} >
                                <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }} >Type d'avis</label>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }} >
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: reviewType === 'general' ? '#3b82f6' : '#64748b' }} >
                                        <input type="radio" checked={reviewType === 'general'} onChange={() => setReviewType('general')} />
                                        Général (Home)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: reviewType === 'product' ? '#3b82f6' : '#64748b' }} >
                                        <input type="radio" checked={reviewType === 'product'} onChange={() => setReviewType('product')} />
                                        Spécifique à un produit
                                    </label>
                                </div>
                            </div>

                            {reviewType === 'product' && (
                                <div className="form-group" style={{ marginBottom: 0, animation: 'fadeIn 0.3s' }} >
                                    <label className="form-label" style={{ fontWeight: '700', color: '#475569', fontSize: '13px' }} >Sélectionner le produit</label>
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

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }} >
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{ flex: 1, padding: '12px', background: 'var(--surface-hover)', fontWeight: '700' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    {submitting ? <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> : null}
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

const SubCategoryManager = ({ openGlobalSeo }) => {
    const [settings, setSettings] = useState(null);
    const [selectedParent, setSelectedParent] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchSettings = () => {
        fetch(`${API_BASE_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setSettings(data.data);
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!selectedParent || !newSubCategory.trim()) return;
        setSubmitting(true);

        const catIndex = settings.categories.findIndex(c => c.name === selectedParent);
        if (catIndex === -1) {
            setSubmitting(false);
            return;
        }

        const updatedCategories = [...settings.categories];
        if (!updatedCategories[catIndex].subCategories) updatedCategories[catIndex].subCategories = [];

        // Check duplicate
        if (updatedCategories[catIndex].subCategories.some(s => s.name === newSubCategory.trim())) {
            setNotification({ message: 'Cette sous-catégorie existe déjà', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            setSubmitting(false);
            return;
        }

        updatedCategories[catIndex].subCategories.push({
            name: newSubCategory.trim(),
            seoH1: '',
            seoSubheadings: []
        });

        const newSettings = { ...settings, categories: updatedCategories };
        // Save
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.data); // Update state with new settings
                setNewSubCategory('');
                setNotification({ message: 'Sous-catégorie ajoutée', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            setNotification({ message: 'Erreur serveur', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (subName) => {
        if (!window.confirm('Supprimer cette sous-catégorie ?')) return;
        setSubmitting(true);

        const catIndex = settings.categories.findIndex(c => c.name === selectedParent);
        const updatedCategories = [...settings.categories];
        updatedCategories[catIndex].subCategories = updatedCategories[catIndex].subCategories.filter(s => s.name !== subName);

        const newSettings = { ...settings, categories: updatedCategories };
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
                setNotification({ message: 'Sous-catégorie supprimée', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            setNotification({ message: 'Erreur serveur', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const parentCat = settings?.categories.find(c => c.name === selectedParent);

    return (
        <div className="admin-card">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }} >
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }} >Gestion de Sous-catégories</h2>
            </div>

            <div className="form-group">
                <label className="form-label">Choisir une Catégorie Principale</label>
                <select
                    className="form-select"
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                >
                    <option value="">-- Sélectionner --</option>
                    {settings?.categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </select>
            </div>

            {selectedParent && (
                <div style={{ marginTop: '20px' }} >
                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }} >
                        <input
                            className="form-input"
                            placeholder="Nom de la sous-catégorie"
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">Ajouter</button>
                    </form>

                    <h3 style={{ fontSize: '16px', marginBottom: '15px' }} >Sous-catégories existantes</h3>
                    {parentCat?.subCategories?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }} >
                            {parentCat.subCategories.map((sub, idx) => (
                                <div key={idx} style={{
                                    background: 'var(--surface-hover)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px'
                                }} >
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }} >{sub.name}</div>
                                    <div style={{ display: 'flex', gap: '10px' }} >
                                        <button
                                            onClick={() => openGlobalSeo(selectedParent, sub.name)}
                                            style={{ flex: 1, padding: '6px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                        >
                                            SEO
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub.name)}
                                            disabled={submitting}
                                            style={{ flex: 1, padding: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {submitting ? (
                                                <div className="admin-loader-sm" style={{ width: '12px', height: '12px', border: '2px solid rgba(239,68,68,0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                            ) : (
                                                'Suppr.'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#94a3b8' }} >Aucune sous-catégorie pour le moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Guide Inquiries Manager Component
const GuideInquiriesManager = ({ openGlobalSeo }) => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '25px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                marginBottom: '30px'
            }} >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} >
                    <div style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }} >
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }} >Questions sur les Articles</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }} >{inquiries.length} question(s) en attente de réponse</p>
                    </div>
                </div>
                <button
                    onClick={openGlobalSeo}
                    className="btn-premium btn-edit"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        color: '#fff',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px'
                    }}
                >
                    <IconSEO /> SEO
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }} >
                    <div className="admin-loader"></div>
                    <p style={{ color: '#64748b', marginTop: '15px' }} >Chargement des questions...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                }} >
                    {inquiries.map((inquiry) => (
                        <div key={inquiry._id} style={{
                            background: 'var(--surface)',
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }} >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
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
                                    }} >
                                        {inquiry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }} >{inquiry.name}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }} >{new Date(inquiry.createdAt).toLocaleString('fr-FR')}</div>
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
                                background: 'rgba(255,255,255,0.03)',
                                padding: '15px',
                                borderRadius: '12px',
                                marginBottom: '15px',
                                borderLeft: '3px solid #fbbf24'
                            }} >
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '5px' }} >Article : {inquiry.articleTitle}</div>
                                <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5' }} >{inquiry.question}</div>
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
                            background: 'var(--surface)',
                            borderRadius: '20px',
                            border: '2px dashed #e2e8f0'
                        }} >
                            <div style={{ fontSize: '50px', marginBottom: '20px' }} >📁</div>
                            <h3 style={{ color: '#1e293b', fontWeight: '800' }} >Aucune question pour le moment</h3>
                            <p style={{ color: '#64748b' }} >Les questions posées par les clients sur les articles apparaîtront ici.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Contact Messages Manager Component
const ContactMessagesManager = ({ openGlobalSeo }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
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

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '25px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                marginBottom: '30px'
            }} >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} >
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }} >
                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }} >Messages de Contact</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }} >{messages.length} message(s) reçu(s)</p>
                    </div>
                </div>
                <button
                    onClick={openGlobalSeo}
                    className="btn-premium btn-edit"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 15px',
                        fontWeight: '600'
                    }}
                >
                    <IconSEO /> SEO
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }} >
                    <div className="admin-loader"></div>
                    <p style={{ color: '#64748b', marginTop: '15px' }} >Chargement des messages...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '20px'
                }} >
                    {messages.map((msg) => (
                        <div key={msg._id} style={{
                            background: 'var(--surface)',
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }} >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} >
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#3b82f6',
                                        fontWeight: '800',
                                        fontSize: '20px'
                                    }} >
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '16px' }} >{msg.name}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }} >{new Date(msg.createdAt).toLocaleString('fr-FR')}</div>
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    onClick={() => handleDelete(msg._id)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {submitting ? (
                                        <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(239,68,68,0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    ) : (
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    )}
                                </button>
                            </div>

                            <div style={{ marginBottom: '15px' }} >
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }} >Sujet</div>
                                <div style={{ color: '#fff', fontWeight: '600' }} >{msg.subject || 'N/A'}</div>
                            </div>

                            <div style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.02)',
                                padding: '15px',
                                borderRadius: '12px',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                border: '1px solid rgba(255,255,255,0.05)',
                                marginBottom: '20px'
                            }} >
                                {msg.message}
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }} >
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
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#fff'
                                }} >
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
                            background: 'var(--surface)',
                            borderRadius: '24px',
                            border: '2px dashed #e2e8f0'
                        }} >
                            <div style={{ fontSize: '64px', marginBottom: '20px' }} >✉️</div>
                            <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '24px' }} >Aucun message reçu</h3>
                            <p style={{ color: '#64748b' }} >Les messages envoyés via la page de contact s'afficheront ici.</p>
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

// Support Manager Component
const SupportManager = ({ openGlobalSeo }) => {
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
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setHeroImage(data.imageUrl);
                showNotification("Image téléchargée !", "success");
            } else {
                showNotification(data.message || "Erreur", "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setUploading(false);
        }
    };
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
            const resConfig = await fetch(`${API_BASE_URL}/api/support/config`);
            const dataConfig = await resConfig.json();

            // Backend returns data: ['Type1', 'Type2'] for types endpoint
            const resTypes = await fetch(`${API_BASE_URL}/api/support/types`);
            const DataTypes = await resTypes.json();

            if (DataTypes.success) {
                setIssueTypes(DataTypes.data || []);
            }

            // Fields and HeroImage endpoints are not yet implemented in backend, avoid crash
            if (dataConfig.success) {
                // If backend eventually supports these in config
                setHeroImage(dataConfig.heroImage || '');
                setCurrentHeroImage(dataConfig.heroImage || '');
                if (dataConfig.fields) setFormFields(dataConfig.fields);
                else setFormFields([]);
            }
        } catch (error) {
            console.error(error);
            setIssueTypes([]);
            setFormFields([]);
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
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification('Ticket supprimé', 'success');
                fetchTickets();
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // --- ISSUE TYPES HANDLERS ---
    const addType = async (e) => {
        e.preventDefault();
        if (!newType.trim()) return;
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
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
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/types/${name}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification('Type supprimé', 'success');
                setIssueTypes(data.data);
            }
        } catch (error) {
            showNotification('Erreur serveur', 'error');
        } finally {
            setSubmitting(false);
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
        setSubmitting(true);
        try {
            await saveFields(updatedFields);
            setNewFieldName('');
            setNewFieldPlaceholder('');
            showNotification('Champ ajouté', 'success');
        } catch (error) {
            // Error managed in saveFields
        } finally {
            setSubmitting(false);
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
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/support/fields`, {
                method: 'POST',
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
        } finally {
            setSubmitting(false);
        }
    };

    const saveHeroImage = async () => {
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    // Custom Confirmation Modal
    const ConfirmationModal = () => {
        if (!confirmModal.show) return null;
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }} >
                <div style={{
                    background: 'var(--surface)', padding: '25px', borderRadius: '12px', width: '400px', maxWidth: '90%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'fadeIn 0.2s ease-out'
                }} >
                    <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }} >{confirmModal.title || 'Confirmer'}</h3>
                    <p style={{ color: '#475569', marginBottom: '25px', lineHeight: '1.5' }} >{confirmModal.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }} >
                        <button
                            onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)',
                                background: 'var(--surface)', color: '#64748b', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={confirmModal.onConfirm}
                            disabled={submitting}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: 'none',
                                background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '500',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            {submitting ? (
                                <div className="admin-loader-sm" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                            ) : null}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }} >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} >
                    <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '24px', margin: 0 }} >Gestion de Support</h2>
                    <button
                        onClick={openGlobalSeo}
                        className="btn-premium btn-edit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#fff',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px'
                        }}
                    >
                        <IconSEO /> SEO
                    </button>
                </div>
                <div className="tab-buttons" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} >
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s', fontSize: '13px',
                            background: activeSubTab === 'tickets' ? '#fff' : 'transparent',
                            color: activeSubTab === 'tickets' ? '#000' : 'rgba(255,255,255,0.5)',
                            boxShadow: activeSubTab === 'tickets' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                        }}
                        onClick={() => setActiveSubTab('tickets')}
                    >
                        Tickets Reçus
                    </button>
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s', fontSize: '13px',
                            background: activeSubTab === 'config' ? '#fff' : 'transparent',
                            color: activeSubTab === 'config' ? '#000' : 'rgba(255,255,255,0.5)',
                            boxShadow: activeSubTab === 'config' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
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
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }} >Chargement des tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px', background: 'var(--surface-hover)', borderRadius: '12px', border: '2px dashed #e2e8f0'
                        }} >
                            <div style={{ fontSize: '40px', marginBottom: '10px' }} >📪</div>
                            <h3 style={{ color: '#475569', marginBottom: '5px' }} >Aucun ticket de support</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }} >Les nouvelles demandes apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div className="tickets-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '25px'
                        }} >
                            {tickets.map(ticket => (
                                <div key={ticket._id} style={{
                                    background: 'var(--surface)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    border: '1px solid var(--border)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }} >
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ticket.issueType === 'Reclamation' ? '#ef4444' : '#3b82f6'
                                    }} ></div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} >
                                            <span style={{
                                                fontSize: '12px', fontWeight: 'bold', color: '#64748b',
                                                background: '#f1f5f9', padding: '6px 10px', borderRadius: '20px'
                                            }} >
                                                # {ticket._id.substr(-6)}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }} >{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span style={{
                                            background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '700',
                                            padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px'
                                        }} >
                                            {ticket.issueType}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '20px', background: 'var(--surface-hover)', padding: '15px', borderRadius: '10px' }} >
                                        {ticket.formDetails && ticket.formDetails.length > 0 ? (
                                            ticket.formDetails.map((field, i) => (
                                                <div key={i} style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }} >
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }} >{field.label}</span>
                                                    <span style={{ fontWeight: '600' }} >{field.value}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }} >
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }} >Nom</span>
                                                    <span style={{ fontWeight: '600' }} >{ticket.name}</span>
                                                </div>
                                                <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }} >
                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }} >Whatsapp</span>
                                                    <span style={{ fontWeight: '600' }} >{ticket.whatsapp}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '20px', flex: 1 }} >
                                        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }} >Message</h4>
                                        <p style={{
                                            margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap', background: 'var(--surface)', padding: '0',
                                        }} >
                                            {ticket.message}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }} >
                                        <button
                                            onClick={() => initiateDeleteTicket(ticket._id)}
                                            style={{
                                                background: 'var(--surface)', color: '#ef4444', border: '1px solid #fee2e2',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} >

                    {/* SECTION 0: HERO IMAGE */}
                    <div className="config-section" style={{
                        background: 'var(--surface)',
                        padding: '25px',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }} >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }} >
                            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: '#3b82f6' }} >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }} >Photo de couverture (Support)</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }} >
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }} >Image Actuelle</label>
                                <div style={{
                                    width: '100%',
                                    height: '140px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)',
                                    position: 'relative',
                                    background: 'var(--surface-hover)'
                                }} >
                                    <img src={currentHeroImage || '/images/support-hero-bg.png'} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' }} >EN LIGNE</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }} >Nouvelle Image (URL / Télécharger)</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} >
                                    <textarea
                                        className="form-input"
                                        placeholder="Collez le nouveau lien ici..."
                                        value={heroImage}
                                        onChange={(e) => setHeroImage(e.target.value)}
                                        style={{ width: '100%', height: '42px', resize: 'none' }}
                                    />
                                    <input type="file" id="support-hero-upload" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />
                                    <label htmlFor="support-hero-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer', height: '42px' }} >
                                        {uploading ? '⌛' : '📁'}
                                    </label>
                                </div>
                                <button
                                    onClick={saveHeroImage}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    disabled={heroImage === currentHeroImage || uploading || submitting}
                                >
                                    {submitting ? (
                                        <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    ) : null}
                                    Appliquer les changements
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* SECTION 1: DYNAMIC FIELDS */}
                    <div className="config-section">
                        <h3>Champs du Formulaire</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9em', marginBottom: '15px' }} >Ajoutez les champs que l'utilisateur doit remplir (ex: Nom, WhatsApp, ID commande).</p>

                        <form onSubmit={addField} style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }} >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }} >
                                <div style={{ flex: 1 }} >
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }} >Libellé (Label)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: Numéro de Téléphone"
                                        value={newFieldName}
                                        onChange={(e) => setNewFieldName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ width: '120px' }} >
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }} >Type</label>
                                    <select
                                        className="form-input"
                                        value={newFieldType}
                                        onChange={(e) => setNewFieldType(e.target.value)}
                                    >
                                        <option value="text">Texte</option>
                                        <option value="number">Nombre</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }} >
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }} >Placeholder (Indicatif)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: +216 55 ..."
                                        value={newFieldPlaceholder}
                                        onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={submitting}>
                                    {submitting ? (
                                        <div className="admin-loader-sm" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    ) : null}
                                    Ajouter
                                </button>
                            </div>
                        </form>

                        <div className="fields-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} >
                            {formFields.map((field, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 15px', borderRadius: '6px'
                                }} >
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} >
                                        <span style={{ fontWeight: '600' }} >{field.label}</span>
                                        <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }} >{field.type}</span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }} >{field.placeholder || 'Pas de placeholder'}</span>
                                    </div>
                                    <button
                                        onClick={() => initiateDeleteField(index)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                            {formFields.length === 0 && <p style={{ color: '#94a3b8' }} >Aucun champ configuré.</p>}
                        </div>
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid var(--border)' }} />

                    {/* SECTION 2: ISSUE TYPES */}
                    <div className="config-section">
                        <h3>Types de Problèmes (Menu déroulant)</h3>
                        <div style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }} >
                            <form onSubmit={addType} style={{ display: 'flex', gap: '10px' }} >
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nouveau type de problème..."
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={submitting}>
                                    {submitting ? (
                                        <div className="admin-loader-sm" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    ) : null}
                                    Ajouter
                                </button>
                            </form>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} >
                            {issueTypes.map((type, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', background: 'var(--surface)',
                                    border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '6px'
                                }} >
                                    <span style={{ fontWeight: '500', marginRight: '10px' }} >{type.name}</span>
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

// ---------------------------------------------------------------------
//                           BUTTON MANAGER
// ---------------------------------------------------------------------
const ButtonManager = () => {
    const [settings, setSettings] = useState(null);
    const [localButtons, setLocalButtons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Define known buttons requested by user
    const KNOWN_BUTTONS = [
        { id: 'btn-add-cart', name: 'Ajouter au panier', defaultBg: '#fbbf24', defaultColor: '#000000', selector: '#btn-add-cart', defaultText: 'Ajouter au panier' },
        { id: 'btn-express', name: 'Commande Express', defaultBg: '#fbbf24', defaultColor: '#000000', selector: '#btn-confirm-order', defaultText: 'Commande Express' },
        { id: 'btn-review', name: 'Rédiger un avis', defaultBg: '#f1f5f9', defaultColor: '#475569', selector: '#btn-review', defaultText: 'Laisser un avis' },
        { id: 'btn-contact-footer', name: 'Contactez-nous à tout moment !', defaultBg: '#fbbf24', defaultColor: '#000000', selector: '.contact-btn', defaultText: 'Contactez-nous à tout moment !' },
        { id: 'btn-help-nav', name: 'Aide (Header)', defaultBg: '#ffd600', defaultColor: '#000000', selector: '.guide-btn-nav', defaultText: 'Aide' },
        { id: 'btn-support-nav', name: 'Support (Header)', defaultBg: '#eff6ff', defaultColor: '#1e40af', selector: '.support-btn-nav', defaultText: 'Support' },
        { id: 'btn-apk', name: 'TÉLÉCHARGER APK', defaultBg: '#f97316', defaultColor: '#ffffff', selector: '.download-app-btn', defaultText: 'TÉLÉCHARGER APK' },
        { id: 'btn-guide-detail', name: "Guide d'installation", defaultBg: '#fef3c7', defaultColor: '#92400e', selector: '.installation-guide-btn', defaultText: "Guide d'installation" }
    ];

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`);
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);

                const savedButtons = data.data.customButtons || [];
                const mergedButtons = KNOWN_BUTTONS.map(kb => {
                    const saved = savedButtons.find(sb => sb.id === kb.id);
                    return {
                        ...kb,
                        backgroundColor: saved ? saved.backgroundColor : kb.defaultBg,
                        color: saved ? (saved.color || kb.defaultColor) : kb.defaultColor,
                        isGradient: saved ? (saved.isGradient || false) : false,
                        gradientColor1: saved ? (saved.gradientColor1 || kb.defaultBg) : kb.defaultBg,
                        gradientColor2: saved ? (saved.gradientColor2 || kb.defaultBg) : kb.defaultBg,
                        gradientAngle: saved ? (saved.gradientAngle || 45) : 45,
                        customText: saved ? (saved.customText || '') : ''
                    };
                });
                setLocalButtons(mergedButtons);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            showNotification("Erreur de chargement", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (id, fields) => {
        setLocalButtons(prev => prev.map(btn =>
            btn.id === id ? { ...btn, ...fields } : btn
        ));
    };

    const saveButtons = async () => {
        setLoading(true);
        try {
            const buttonsToSave = localButtons.map(btn => ({
                id: btn.id,
                name: btn.name,
                selector: btn.selector,
                backgroundColor: btn.backgroundColor,
                color: btn.color,
                isGradient: btn.isGradient,
                gradientColor1: btn.gradientColor1,
                gradientColor2: btn.gradientColor2,
                gradientAngle: btn.gradientAngle,
                customText: btn.customText
            }));

            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customButtons: buttonsToSave })
            });

            const data = await res.json();
            if (data.success) {
                showNotification("Design des boutons mis à jour !", "success");
                setSettings(data.data);
            } else {
                showNotification("Erreur lors de la sauvegarde", "error");
            }
        } catch (error) {
            console.error("Save error:", error);
            showNotification("Erreur serveur", "error");
        } finally {
            setLoading(false);
        }
    };

    const getButtonStyle = (btn) => {
        const style = {
            color: btn.color,
            padding: '12px 28px',
            borderRadius: '10px',
            fontWeight: '600',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'default',
            fontSize: '14px',
            display: 'block',
            width: '100%',
            textAlign: 'center'
        };

        if (btn.isGradient) {
            style.background = `linear-gradient(${btn.gradientAngle}deg, ${btn.gradientColor1}, ${btn.gradientColor2})`;
        } else {
            style.backgroundColor = btn.backgroundColor;
        }

        return style;
    };

    return (
        <div style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }} >
            {notification && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    padding: '15px 25px', borderRadius: '8px',
                    background: notification.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px'
                }} >
                    <span>{notification.type === 'success' ? '✅' : '⚠️'}</span>
                    {notification.message}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }} >
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' }} >Personnalisation des Boutons</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }} >Gérez les couleurs et les dégradés pour chaque bouton clé.</p>
                </div>
                <button
                    onClick={saveButtons}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                        padding: '12px 30px',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {loading ? (
                        <>
                            <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                            <span>Sauvegarde...</span>
                        </>
                    ) : (
                        'Enregistrer Tout'
                    )}
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '25px'
            }} >
                {localButtons.map(btn => (
                    <div key={btn.id} style={{
                        background: 'var(--surface)',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column'
                    }} >
                        <div style={{ marginBottom: '15px' }} >
                            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '5px' }} >{btn.name}</h3>
                            <code style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', padding: '4px 8px', borderRadius: '6px' }} >{btn.selector}</code>
                        </div>

                        {/* Preview */}
                        <div style={{
                            background: 'var(--surface-hover)',
                            padding: '30px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border)'
                        }} >
                            <button style={getButtonStyle(btn)}>
                                {btn.customText || btn.defaultText || btn.name}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }} >
                            {/* Text Content Input */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} >
                                <label style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }} >Texte du bouton</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={btn.customText !== undefined ? btn.customText : (btn.defaultText || btn.name)}
                                    placeholder={btn.defaultText || btn.name}
                                    onChange={(e) => handleUpdate(btn.id, { customText: e.target.value })}
                                />
                            </div>
                            {/* Text Color Selector */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }} >Couleur du Texte</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} >
                                    <input
                                        type="color"
                                        value={btn.color}
                                        onChange={(e) => handleUpdate(btn.id, { color: e.target.value })}
                                        style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        value={btn.color}
                                        onChange={(e) => handleUpdate(btn.id, { color: e.target.value })}
                                        style={{ width: '80px', fontSize: '12px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '0' }} />

                            {/* Gradient Toggle */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }} >Type de Fond</span>
                                <div style={{
                                    display: 'flex',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '4px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }} >
                                    <button
                                        onClick={() => handleUpdate(btn.id, { isGradient: false })}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            background: !btn.isGradient ? '#fff' : 'transparent',
                                            color: !btn.isGradient ? '#000' : 'rgba(255,255,255,0.5)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Couleur Unie
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(btn.id, { isGradient: true })}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            background: btn.isGradient ? '#fff' : 'transparent',
                                            color: btn.isGradient ? '#000' : 'rgba(255,255,255,0.5)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Dégradé
                                    </button>
                                </div>
                            </div>

                            {btn.isGradient ? (
                                <div style={{ display: 'grid', gap: '15px', padding: '15px', background: 'var(--surface-hover)', borderRadius: '12px' }} >
                                    <div style={{ display: 'flex', gap: '15px' }} >
                                        <div style={{ flex: 1 }} >
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '5px' }} >COULEUR 1</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} >
                                                <input
                                                    type="color"
                                                    value={btn.gradientColor1}
                                                    onChange={(e) => handleUpdate(btn.id, { gradientColor1: e.target.value })}
                                                    style={{ width: '100%', height: '30px', border: 'none', cursor: 'pointer', background: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }} >
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '5px' }} >COULEUR 2</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} >
                                                <input
                                                    type="color"
                                                    value={btn.gradientColor2}
                                                    onChange={(e) => handleUpdate(btn.id, { gradientColor2: e.target.value })}
                                                    style={{ width: '100%', height: '30px', border: 'none', cursor: 'pointer', background: 'none' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }} >
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }} >ANGLE</label>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }} >{btn.gradientAngle}°</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={btn.gradientAngle}
                                            onChange={(e) => handleUpdate(btn.id, { gradientAngle: parseInt(e.target.value) })}
                                            style={{ width: '100%', accentColor: '#fbbf24' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#444' }} >Couleur de Fond</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} >
                                        <input
                                            type="color"
                                            value={btn.backgroundColor}
                                            onChange={(e) => handleUpdate(btn.id, { backgroundColor: e.target.value })}
                                            style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', background: 'none' }}
                                        />
                                        <input
                                            type="text"
                                            value={btn.backgroundColor}
                                            onChange={(e) => handleUpdate(btn.id, { backgroundColor: e.target.value })}
                                            style={{ width: '80px', fontSize: '12px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TwoFactorManager = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [status, setStatus] = useState(null); // 'enabled' | 'disabled'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check current status
        fetch(`${API_BASE_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus(data.data.twoFactorEnabled ? 'enabled' : 'disabled');
                }
                setLoading(false);
            });
    }, []);

    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3>Gestion Authentification 2FA (Admin)</h3>
            </div>
            <div style={{ padding: '40px', textAlign: 'center' }} >
                <div style={{ marginBottom: '30px' }} >
                    <div style={{ fontSize: '18px', marginBottom: '10px' }} >Statut de la double authentification :</div>
                    <div style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        background: status === 'enabled' ? '#dcfce7' : '#fee2e2',
                        color: status === 'enabled' ? '#166534' : '#991b1b',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        border: `1px solid ${status === 'enabled' ? '#86efac' : '#fca5a5'}`
                    }} >
                        {loading ? 'Chargement...' : (status === 'enabled' ? '✅ ACTIVÉE' : '❌ DÉSACTIVÉE')}
                    </div>
                </div>

                <p style={{ maxWidth: '600px', margin: '0 auto 30px auto', color: '#64748b', lineHeight: '1.6' }} >
                    La validation en deux étapes ajoute une couche de sécurité supplémentaire à votre compte administrateur.
                    Une fois activée, vous devrez saisir un code unique généré par votre application mobile à chaque connexion.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() => setIsSetupOpen(true)}
                    style={{ fontSize: '16px', padding: '12px 30px', height: 'auto' }}
                >
                    {status === 'enabled' ? 'Gérer / Désactiver 2FA' : 'Activer la 2FA Maintenant'}
                </button>

                {isSetupOpen && (
                    <TwoFactorSetup
                        user={{ id: 'admin', twoFactorEnabled: status === 'enabled' }}
                        onClose={() => setIsSetupOpen(false)}
                        onUpdateUser={(u) => setStatus(u.twoFactorEnabled ? 'enabled' : 'disabled')}
                    />
                )}
            </div>
        </div>
    );
};

const ApplicationsManager = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [newApp, setNewApp] = useState({
        name: '',
        icon: '',
        downloadLink: '',
        description: '',
        os: 'Android'
    });
    const [submitting, setSubmitting] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setNewApp(prev => ({ ...prev, icon: data.imageUrl }));
                showNotification("Icône téléchargée !", "success");
            } else {
                showNotification(data.message || "Erreur de téléchargement", "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setUploading(false);
        }
    };

    const fetchApps = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/applications`);
            const data = await res.json();
            if (data.success) setApps(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const method = editingApp ? 'PUT' : 'POST';
        const url = editingApp
            ? `${API_BASE_URL}/api/applications/${editingApp._id}`
            : `${API_BASE_URL}/api/applications`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newApp)
            });
            const data = await res.json();
            if (data.success) {
                showNotification(editingApp ? "Application mise à jour" : "Application ajoutée", "success");
                setIsModalOpen(false);
                setEditingApp(null);
                setNewApp({ name: '', icon: '', downloadLink: '', description: '', os: 'Android' });
                fetchApps();
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette application ?")) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/applications/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification("Application supprimée", "success");
                fetchApps();
            }
        } catch (error) {
            showNotification("Erreur serveur", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setNewApp({
            name: app.name,
            icon: app.icon,
            downloadLink: app.downloadLink,
            description: app.description || '',
            os: app.os || 'Android'
        });
        setIsModalOpen(true);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} >
            <div className="admin-spinner"></div>
        </div>
    );

    return (
        <div className="admin-view-container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }} >
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }} >Gestion des Applications</h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }} >Liste des applications disponibles au téléchargement</p>
                </div>
                <button
                    className="btn-premium"
                    onClick={() => { setEditingApp(null); setNewApp({ name: '', icon: '', downloadLink: '', description: '', os: 'Android' }); setIsModalOpen(true); }}
                    style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none' }}
                >
                    + Ajouter une App
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }} >
                {apps.map(app => (
                    <div key={app._id} style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', backdropFilter: 'blur(10px)' }} >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }} >
                            <img src={app.icon} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', background: 'rgba(255,255,255,0.05)' }} />
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }} >{app.name}</h3>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }} >
                                    <span style={{ padding: '2px 6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '4px', fontWeight: '700' }} >{app.os}</span>
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', minHeight: '40px', margin: '0 0 15px 0' }} >{app.description || 'Aucune description.'}</p>
                        <div style={{ display: 'flex', gap: '10px' }} >
                            <button onClick={() => handleEdit(app)} className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '13px' }} >Modifier</button>
                            <button
                                disabled={submitting}
                                onClick={() => handleDelete(app._id)}
                                className="btn"
                                style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {submitting ? (
                                    <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(239,68,68,0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                ) : (
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingApp ? 'Modifier Application' : 'Nouvelle Application'}
            >
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} >
                    <div className="form-group">
                        <label className="form-label">Nom de l'application</label>
                        <input className="form-input" value={newApp.name} onChange={e => setNewApp({ ...newApp, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Système d'exploitation</label>
                        <select className="form-input" value={newApp.os} onChange={e => setNewApp({ ...newApp, os: e.target.value })}>
                            <option value="Android">Android</option>
                            <option value="Windows">Windows</option>
                            <option value="iOS">iOS</option>
                            <option value="Other">Autre</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Icône de l'application</label>
                        <div style={{ display: 'flex', gap: '8px' }} >
                            <input className="form-input" value={newApp.icon} onChange={e => setNewApp({ ...newApp, icon: e.target.value })} placeholder="URL ou téléchargez" required />
                            <input type="file" id="app-icon-upload" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />
                            <label htmlFor="app-icon-upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', cursor: 'pointer' }} >
                                {uploading ? '⌛' : '📁'}
                            </label>
                        </div>
                        {newApp.icon && <img src={newApp.icon} alt="Preview" style={{ width: '40px', height: '40px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Lien de téléchargement</label>
                        <input className="form-input" value={newApp.downloadLink} onChange={e => setNewApp({ ...newApp, downloadLink: e.target.value })} placeholder="https://..." required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description (Optionnelle)</label>
                        <textarea className="form-input" value={newApp.description} onChange={e => setNewApp({ ...newApp, description: e.target.value })} style={{ height: '80px' }} ></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {submitting ? (
                                <div className="admin-loader-sm" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                            ) : null}
                            {editingApp ? 'Enregistrer les modifications' : 'Ajouter l\'application'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

