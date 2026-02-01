import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import './ProductsPage.css';
import SEO from '../components/SEO/SEO';
import { generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { API_BASE_URL } from '../config';

const CATEGORIES_META = {
    streaming: {
        title: 'Streaming',
        description: "Découvrez les meilleures offres de streaming en Tunisie sur Satpromax : Netflix, Shahid VIP, OSN+, YouTube Premium et plus, à prix imbattables !",
    },
    'iptv-sharing': {
        title: 'Abonnement IPTV',
        description: "Profitez d'une large sélection d'abonnements IPTV et Sharing pour toutes vos chaînes préférées.",
    },
    music: {
        title: 'Musique',
        description: "Écoutez votre musique préférée sans interruption avec nos abonnements premium.",
    },
    musique: {
        title: 'Musique',
        description: "Écoutez votre musique préférée sans interruption avec nos abonnements premium.",
    },
    'box-android': {
        title: 'Box Android & Recepteur',
        description: "Transformez votre TV avec nos Box Android et Récepteurs dernière génération.",
    },
    'box-android-recepteur': {
        title: 'Box Android & Recepteur',
        description: "Transformez votre TV avec nos Box Android et Récepteurs dernière génération.",
    },
    gaming: {
        title: 'Gaming',
        description: "Cartes cadeaux et abonnements pour PSN, Xbox, Steam et plus.",
    },
    'gift-card': {
        title: 'Cartes Cadeaux',
        description: "Offrez le cadeau parfait avec nos cartes cadeaux digitales.",
    },
    'cartes-cadeaux': {
        title: 'Cartes Cadeaux',
        description: "Offrez le cadeau parfait avec nos cartes cadeaux digitales.",
    },
    software: {
        title: 'Logiciels',
        description: "Logiciels et outils de productivité pour professionnels et particuliers.",
    },
    logiciels: {
        title: 'Logiciels',
        description: "Logiciels et outils de productivité pour professionnels et particuliers.",
    },
    promotions: {
        title: '🔥 Offres Spéciales',
        description: "Profitez de nos meilleures réductions et offres limitées !",
    }
};

const CATEGORY_DB_MAP = {
    'streaming': 'Streaming',
    'iptv-sharing': 'Abonnement IPTV',
    'iptv-premium': 'IPTV Premium',
    'music': 'Musique',
    'musique': 'Musique',
    'box-android': 'Box Android & Recepteur',
    'box-android-recepteur': 'Box Android & Recepteur',
    'gaming': 'Gaming',
    'gift-card': 'Cartes Cadeaux',
    'cartes-cadeaux': 'Cartes Cadeaux',
    'software': 'Logiciels',
    'logiciels': 'Logiciels',
    'promotions': 'Promotions' // Virtual
};

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-title" style={{ width: '60%' }}></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-actions">
                    <div className="skeleton-btn"></div>
                    <div className="skeleton-btn"></div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product, addToCart, addToWishlist }) => {
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsAdded(true);
        addToCart(product);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        setIsWishlisted(true);
        addToWishlist(product);
        setTimeout(() => setIsWishlisted(false), 2000);
    }

    const isPromoActive = product.promoPrice && new Date(product.promoEndDate) > new Date();

    return (
        <Link to={`/${slugify(product.category)}/${product.slug || slugify(product.name)}`} className="category-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            {isPromoActive && (
                <div className="card-badge_2 promo_2">
                    <img src="https://i.ibb.co/4x2XwJy/pngtree-special-promo-banner-shape-vector-png-image-7113277.png" alt="Promo" />

                </div>
            )}
            <div className="cat-product-img-wrapper">
                {/* Heart Icon for Wishlist */}
                <button
                    className={`wishlist-icon-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={handleAddToWishlist}
                    title="Ajouter à la liste"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <img src={product.image} alt={product.name} />
            </div>
            <div className="cat-product-info">
                <h3 className="cat-product-title">{product.name}</h3>
                <div className="cat-product-price">
                    {isPromoActive ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9em', marginRight: '8px' }}>
                                {product.price}
                            </span>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                {product.promoPrice}
                            </span>
                        </>
                    ) : (
                        product.price
                    )}
                </div>
                <div className="card-actions">
                    <button className="btn-options btn-details">détails</button>
                    <button
                        className={`btn-options btn-add ${isAdded ? 'added' : ''}`}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <span>AJOUTÉ <br /> ✔</span>
                        ) : (
                            <span>Ajouter</span>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
};

const ProductListCard = ({ product, addToCart }) => {
    const isPromoActive = product.promoPrice && (!product.promoEndDate || new Date(product.promoEndDate) > new Date());

    return (
        <div className="product-list-card">
            <div className="list-card-image-wrapper">
                <Link to={`/${slugify(product.category)}/${product.slug || slugify(product.name)}`}>
                    <img src={product.image} alt={product.name} />
                </Link>
                {isPromoActive && (
                    <div className="list-promo-badge">PROMO</div>
                )}
            </div>
            <div className="list-card-details">
                <Link to={`/${slugify(product.category)}/${product.slug || slugify(product.name)}`} className="list-card-title">
                    {product.name}
                </Link>
                <div className="list-card-description">
                    {product.description && product.description.length > 200
                        ? product.description.substring(0, 200) + "..."
                        : product.description}
                </div>
                {/* Fallback for Code for Downloader if in description or static */}
                {product.description && product.description.includes('Code') && (
                    <p style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>{/* Extracted or just shown in desc */}</p>
                )}

                {product.downloadLink && (
                    <a href={product.downloadLink} target="_blank" rel="noopener noreferrer" className="btn-download-apk">
                        Télécharger App
                    </a>
                )}
            </div>
            <div className="list-card-actions-col">
                <div className="availability-status">
                    Availability: <span className="in-stock">in stock</span>
                </div>
                <div className="list-card-price">
                    {isPromoActive ? (
                        <>
                            <span className="old-price">{product.price}</span>
                            <span className="promo-price">{product.promoPrice}</span>
                        </>
                    ) : (
                        product.price
                    )}
                </div>
                <button className="btn-list-add" onClick={() => addToCart(product)}>
                    AJOUTER AU PANIER
                </button>
                <Link to={`/${slugify(product.category)}/${product.slug || slugify(product.name)}`} className="btn-list-view">
                    VUE RAPIDE
                </Link>
            </div>
        </div>
    );
};

export default function ProductsPage() {
    const { categoryName } = useParams();
    const { addToCart, addToWishlist, categories } = useContext(ShopContext);

    const [viewMode, setViewMode] = useState('grid');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResolution, setSelectedResolution] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Popularité');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);


    // Normalize categoryName for lookup
    const normalizedCategory = categoryName ? categoryName.toLowerCase() : '';

    // Find dynamic category metadata from DB
    const dynamicCategory = categories.find(c =>
        (c.slug && c.slug.toLowerCase() === normalizedCategory) ||
        slugify(c.name) === normalizedCategory
    );

    const meta = dynamicCategory ? {
        title: dynamicCategory.title || dynamicCategory.name,
        description: dynamicCategory.description || `Découvrez notre sélection de produits ${dynamicCategory.name}.`
    } : CATEGORIES_META[normalizedCategory] || {
        title: categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ') : 'Produits',
        description: `Découvrez notre sélection de produits ${categoryName ? categoryName.replace(/-/g, ' ') : ''}.`
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Determine the category to fetch from DB based on URL param
                const dbCategory = CATEGORY_DB_MAP[normalizedCategory];

                let url = `${API_BASE_URL}/api/products`;
                if (dbCategory && normalizedCategory !== 'promotions') {
                    url += `?category=${encodeURIComponent(dbCategory)}`;
                } else if (categoryName && normalizedCategory !== 'promotions') {
                    url += `?category=${encodeURIComponent(categoryName.replace(/-/g, ' '))}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const result = await response.json();
                let fetchedProducts = result.data || [];

                // Filter for Promotions if requested
                if (normalizedCategory === 'promotions') {
                    fetchedProducts = fetchedProducts.filter(p =>
                        p.promoPrice &&
                        p.promoPrice.trim() !== '' &&
                        (!p.promoEndDate || new Date(p.promoEndDate) > new Date())
                    );
                }

                setProducts(fetchedProducts);

            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Impossible de charger les produits. Vérifiez votre connexion.");
            } finally {
                // Add a small delay to show off the skeleton (optional, can be removed)
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchProducts();
    }, [normalizedCategory, categoryName]);

    // Apply filtering on the client side
    useEffect(() => {
        let filtered = [...products];

        if (normalizedCategory === 'iptv-sharing' && selectedResolution !== 'All') {
            filtered = filtered.filter(p =>
                p.resolution && p.resolution.toLowerCase().includes(selectedResolution.toLowerCase())
            );
        }

        if (selectedRegion !== 'All') {
            filtered = filtered.filter(p =>
                p.region && p.region.toLowerCase().includes(selectedRegion.toLowerCase())
            );
        }

        // Apply Sorting
        if (selectedSort === 'Prix: Croissant') {
            filtered.sort((a, b) => {
                const priceA = parseFloat(String(a.price).replace(/[^\d.]/g, '')) || 0;
                const priceB = parseFloat(String(b.price).replace(/[^\d.]/g, '')) || 0;
                return priceA - priceB;
            });
        } else if (selectedSort === 'Nouveauté') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page on filter/sort change
    }, [products, selectedResolution, selectedRegion, normalizedCategory, selectedSort]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);



    // Extract unique regions for the filter
    const availableRegions = [...new Set(products
        .map(p => p.region)
        .filter(r => r && r.trim() !== '')
    )].sort();

    const isIPTV = normalizedCategory === 'iptv-sharing';


    // Prepare SEO Data
    const breadcrumbs = [
        { name: 'Accueil', url: 'https://Satpromax.com' },
        { name: meta.title, url: window.location.href }
    ];

    return (
        <div className="page-wrapper">
            <SEO
                title={meta.title}
                description={meta.description}
                canonical={window.location.href}
                schemas={[generateBreadcrumbSchema(breadcrumbs)]}
            />
            <Header />

            <main className="main-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link to="/" className="breadcrumb-item home">Accueil</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-item active">{meta.title}</span>
                    </div>

                    <div className="category-description">
                        <p>{meta.description}</p>
                    </div>

                    {/* Toolbar */}
                    <div className="products-toolbar">
                        <div className="toolbar-left">
                            <div className="view-toggles">
                                <button
                                    className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" /></svg>
                                </button>
                                <button
                                    className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h2v2H1V2zm4 0h10v2H5V2zM1 7h2v2H1V7zm4 0h10v2H5V7zM1 12h2v2H1V12zm4 0h10v2H5V12z" /></svg>
                                </button>
                            </div>
                            <span className="result-count">
                                {loading ? 'Chargement...' : `${filteredProducts.length} résultats affichés`}
                            </span>
                        </div>
                        <div className="toolbar-right">
                            {isIPTV && (
                                <>
                                    <select
                                        className="filter-select resolution-filter"
                                        value={selectedResolution}
                                        onChange={(e) => setSelectedResolution(e.target.value)}
                                    >
                                        <option value="All">Résolution: Toutes</option>
                                        <option value="4K">Résolution 4K</option>
                                        <option value="FHD">Résolution FHD</option>
                                        <option value="HD">Résolution HD</option>
                                    </select>
                                    <select
                                        className="filter-select region-filter"
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                    >
                                        <option value="All">Région: Toutes</option>
                                        {availableRegions.map((region, idx) => (
                                            <option key={idx} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                            <select
                                className="sort-select"
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                            >
                                <option value="Popularité">Popularité</option>
                                <option value="Nouveauté">Nouveauté</option>
                                <option value="Prix: Croissant">Prix: Croissant</option>
                            </select>
                            <select
                                className="limit-select"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="4">4 par page</option>
                                <option value="8">8 par page</option>
                                <option value="20">20 par page</option>
                                <option value="50">50 par page</option>
                                <option value="100">100 par page</option>
                            </select>

                        </div>
                    </div>

                    {/* Products Grid */}
                    {error && (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'red', gridColumn: '1/-1' }}>
                            {error}
                        </div>
                    )}
                    <div className={`category-products-grid ${viewMode}`}>
                        {loading ? (
                            // Show Skeletons
                            Array.from({ length: itemsPerPage }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            filteredProducts.length > 0 ? (
                                filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(product => (
                                    viewMode === 'list' ? (
                                        <ProductListCard
                                            key={product._id || product.id}
                                            product={product}
                                            addToCart={addToCart}
                                        />
                                    ) : (
                                        <ProductCard
                                            key={product._id || product.id}
                                            product={product}
                                            addToCart={addToCart}
                                            addToWishlist={addToWishlist}
                                        />
                                    )
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#666' }}>
                                    Aucun produit trouvé dans cette catégorie.
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && filteredProducts.length > itemsPerPage && (
                        <div className="pagination-container" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '60px',
                            marginBottom: '40px'
                        }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-arrow-btn"
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    background: '#fff',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.4 : 1,
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                Précédent
                            </button>

                            <div className="pagination-numbers" style={{ display: 'flex', gap: '8px' }}>
                                {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`pagination-number-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '12px',
                                            border: currentPage === idx + 1 ? 'none' : '1px solid #e2e8f0',
                                            background: currentPage === idx + 1 ? '#0ea5e9' : '#fff',
                                            color: currentPage === idx + 1 ? '#fff' : '#475569',
                                            cursor: 'pointer',
                                            fontWeight: '800',
                                            fontSize: '15px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: currentPage === idx + 1 ? '0 10px 15px -3px rgba(14, 165, 233, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                                className="pagination-arrow-btn"
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    background: '#fff',
                                    cursor: currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 0.4 : 1,
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                            >
                                Suivant
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    )
}
