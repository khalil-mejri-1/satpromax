import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import './CheckoutPage.css';
import { countryCodes } from '../data/countryCodes';
import { API_BASE_URL } from '../config';

export default function CheckoutPage() {
    const { cartItems, getCartTotal, removeFromCart, updateCartItemDevice, clearCart } = useContext(ShopContext);
    const cartTotal = getCartTotal();
    const hasShipping = cartItems.some(item => item.hasDelivery);
    const shippingCost = hasShipping ? 7 : 0;
    const finalTotal = cartTotal + shippingCost;
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or online
    const user = JSON.parse(localStorage.getItem('user'));

    const [selectedCountryCode, setSelectedCountryCode] = useState('+216');
    const [localWhatsapp, setLocalWhatsapp] = useState('');

    // Billing State
    const [billingInfo, setBillingInfo] = useState({
        name: user ? user.username : '',
        whatsapp: '',
        paymentMode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
    };

    const [paymentModes, setPaymentModes] = useState([]);
    const [deviceChoices, setDeviceChoices] = useState([]);
    const [whatsappNumber, setWhatsappNumber] = useState("21697496300");

    // Fetch Payment Modes
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setPaymentModes(data.data.paymentModes || []);
                    setDeviceChoices(data.data.deviceChoices || ['Smart TV', 'Android Box', 'Smartphone/Tablet', 'PC/Laptop']);
                    if (data.data.paymentModes && data.data.paymentModes.length > 0) {
                        setBillingInfo(prev => ({ ...prev, paymentMode: data.data.paymentModes[0].name }));
                    }
                    if (data.data.whatsappNumber) {
                        setWhatsappNumber(data.data.whatsappNumber);
                    }
                }
            })
            .catch(err => console.error(err));
    }, []);

    const [modal, setModal] = useState({ show: false, message: '', type: 'success' }); // type: success or error

    const handleCheckout = async () => {
        const customerName = (billingInfo.name || "").trim();

        if (!customerName) {
            setModal({ show: true, message: "Veuillez entrer votre nom.", type: 'error' });
            return;
        }

        if (customerName.length < 2) {
            setModal({ show: true, message: "Le nom est too short (min 2 caractères).", type: 'error' });
            return;
        }

        if (customerName.length > 20) {
            setModal({ show: true, message: "Le nom est too long (max 20 caractères).", type: 'error' });
            return;
        }

        if (/\d/.test(customerName)) {
            setModal({ show: true, message: "Le nom ne doit pas contenir de chiffres.", type: 'error' });
            return;
        }

        if (!billingInfo.whatsapp || !localWhatsapp || localWhatsapp.trim().length === 0) {
            setModal({ show: true, message: "Veuillez entrer votre numéro WhatsApp.", type: 'error' });
            return;
        }

        if (cartItems.length === 0) {
            setModal({ show: true, message: "Votre panier est vide.", type: 'error' });
            return;
        }

        const missingDevice = cartItems.find(item =>
            (item.category === 'IPTV Premium' || item.category === 'Abonnement IPTV') && !item.selectedDevice
        );

        if (missingDevice) {
            setModal({ show: true, message: `Veuillez choisir votre appareil pour le produit: ${missingDevice.name}`, type: 'error' });
            return;
        }

        const missingSerial = cartItems.find(item =>
            (item.category && item.category.toLowerCase().includes('sharing')) && !item.receiverSerial
        );

        if (missingSerial) {
            setModal({ show: true, message: `Veuillez entrer le numéro de série du récepteur pour: ${missingSerial.name}`, type: 'error' });
            return;
        }

        const orderData = {
            userId: user ? (user._id || user.id) : null,
            isGuest: !user,
            userValidation: {
                name: customerName,
                whatsapp: billingInfo.whatsapp
            },
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                deviceChoice: item.selectedDevice || null,
                receiverSerial: item.receiverSerial || null,
                macAddress: item.macAddress || null,
                deviceKey: item.deviceKey || null
            })),
            totalAmount: finalTotal,
            paymentMethod: billingInfo.paymentMode || 'cod'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                // Construct WhatsApp message for multiple items
                let itemsList = "";
                cartItems.forEach((item, index) => {
                    itemsList += `${index + 1}. ${item.name}\n` +
                        `   Quantite: ${item.quantity}\n` +
                        `   Prix: ${item.price}\n` +
                        (item.selectedDevice ? `   Appareil: ${item.selectedDevice}\n` : "") +
                        (item.receiverSerial ? `   S/N Récepteur: ${item.receiverSerial}\n` : "") +
                        (item.macAddress ? `   MAC: ${item.macAddress}\n` : "") +
                        (item.deviceKey ? `   Key: ${item.deviceKey}\n` : "") +
                        `\n`;
                });

                const messageText =
                    `*Nouvelle Commande Panier*\n\n` +
                    `Produits:\n${itemsList}` +
                    `---------------------------\n` +
                    `Total: ${finalTotal} DT\n` +
                    `---------------------------\n\n` +
                    `Informations Client:\n` +
                    `Nom: ${customerName}\n` +
                    `Telephone: ${billingInfo.whatsapp}\n` +
                    `Email: ${user ? user.email : "Non connecte"}\n` +
                    `Paiement: ${billingInfo.paymentMode || "COD"}\n\n` +
                    `Merci de confirmer cette commande.`;

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`;

                // Redirect to WhatsApp immediately
                window.open(whatsappUrl, '_blank');

                clearCart();
                setReviewModalOpen(true);
                // setModal({
                //     show: true,
                //     message: "Votre commande a été enregistrée et vous avez été redirigé vers WhatsApp pour la confirmation finale.",
                //     type: 'success',
                //     onClose: () => {
                //         navigate(user ? '/profile' : '/');
                //     }
                // });
            } else {
                setModal({ show: true, message: "Erreur: " + data.message, type: 'error' });
            }
        } catch (error) {
            console.error("Checkout error:", error);
            setModal({ show: true, message: "Une erreur s'est produite lors de la commande. Veuillez réessayer.", type: 'error' });
        }
    };

    const closeModal = () => {
        setModal({ ...modal, show: false });
        if (modal.onClose) modal.onClose();
    };

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        username: user ? user.username : '',
        comment: '',
        rating: 5
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingReview) return;

        setIsSubmittingReview(true);
        // Determine productId: verify if we can send a review without productId or use the first item's ID
        // For now, if multiple items, maybe we just review the first one, or send null if backend supports it.
        // Assuming we pick the first item ID for the review.
        const firstItemId = cartItems.length > 0 ? cartItems[0].id : null;

        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: firstItemId, // Attaching to first item or null
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
                    title: "Avis Reçu",
                    message: "Votre avis a été envoyé avec succès !",
                    type: 'success',
                    onClose: () => navigate(user ? '/profile' : '/')
                });
                setReviewModalOpen(false);
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

    return (
        <div className="checkout-page-wrapper">
            <Header />

            {/* Custom Modal */}
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

            <div className="checkout-container">

                {/* Order Summary (Now First) */}
                <div className="checkout-section order-section">
                    <div className="order-card">
                        <h2 className="section-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            Votre Commande
                        </h2>

                        <div className="checkout-products">
                            {cartItems.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Votre panier est vide.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="checkout-product-item">
                                        <div className="checkout-product-main">
                                            <Link to={`/${slugify(item.category || 'all')}/${item.slug || slugify(item.name)}`} className="checkout-product-link-wrapper">
                                                <img src={item.image} alt={item.name} className="checkout-product-img" />
                                                <div className="checkout-product-info">
                                                    <div className="checkout-product-name-row">
                                                        <div className="checkout-product-name">{item.name}</div>
                                                        <button
                                                            className="remove-item-btn mobile-only"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(item.id); }}
                                                            title="Supprimer du panier"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                    <div className="checkout-product-meta">Qté: {item.quantity}</div>
                                                    <div className="checkout-product-price-mobile mobile-only">{item.price}</div>
                                                </div>
                                            </Link>

                                            {/* Device Choice Display/Select - Moved outside Link */}
                                            {((item.category === 'IPTV Premium' || item.category === 'Abonnement IPTV')) && (
                                                <div className="checkout-product-device">
                                                    {item.selectedDevice ? (
                                                        <span className="device-tag">Appareil: {item.selectedDevice}</span>
                                                    ) : (
                                                        <div className="device-select-wrapper">
                                                            <label>Choisi mon appareil:</label>
                                                            <select
                                                                value={item.selectedDevice || ""}
                                                                onChange={(e) => updateCartItemDevice(item.id, e.target.value)}
                                                                className="mini-device-select"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <option value="">Choisir...</option>
                                                                {deviceChoices.map((choice, idx) => (
                                                                    <option key={idx} value={choice}>{choice}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {item.receiverSerial && (
                                                <div className="checkout-product-device" style={{ marginTop: '5px' }}>
                                                    <span className="device-tag" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                                                        S/N: {item.receiverSerial}
                                                    </span>
                                                </div>
                                            )}
                                            {(item.macAddress || item.deviceKey) && (
                                                <div className="checkout-product-device" style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {item.macAddress && (
                                                        <span className="device-tag" style={{ background: '#ecfdf5', color: '#059669' }}>
                                                            MAC: {item.macAddress}
                                                        </span>
                                                    )}
                                                    {item.deviceKey && (
                                                        <span className="device-tag" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                                            Key: {item.deviceKey}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="checkout-product-total desktop-only">
                                            <div className="price-tag">{item.price}</div>
                                            <button
                                                className="remove-item-btn"
                                                onClick={() => removeFromCart(item.id)}
                                                title="Supprimer du panier"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Sous-total</span>
                                <span>{cartTotal} DT</span>
                            </div>
                            {hasShipping && (
                                <div className="total-row">
                                    <span>Expédition</span>
                                    <span>{shippingCost} DT</span>
                                </div>
                            )}
                            <div className="total-row final">
                                <span>Total</span>
                                <span>{finalTotal} DT</span>
                            </div>
                        </div>

                        {user ? (
                            <>
                                {/* <div className="payment-methods">
                                    <div
                                        className={`payment-method-item ${paymentMethod === 'cod' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="radio-circle"></div>
                                        <span className="payment-label">Paiement à la livraison</span>
                                        <div className="payment-icons">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect><line x1="16" y1="8" x2="20" y2="8"></line><line x1="16" y1="16" x2="23" y2="16"></line><rect x="1" y="3" width="15" height="5" fill="rgba(0,0,0,0.1)"></rect></svg>
                                        </div>
                                    </div>
                                    <div
                                        className={`payment-method-item ${paymentMethod === 'online' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('online')}
                                    >
                                        <div className="radio-circle"></div>
                                        <span className="payment-label">Paiement en ligne </span>
                                        <div className="payment-icons">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                        </div>
                                    </div>
                                </div> */}

                                <button className="btn-checkout" onClick={handleCheckout}>
                                    COMMANDER
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                                </button>
                            </>
                        ) : (
                            <div className="checkout-blocked-msg">
                                <p>Veuillez vous connecter pour finaliser votre commande.</p>
                            </div>
                        )}

                        <p style={{ marginTop: '15px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.4' }}>
                            Vos données personnelles seront utilisées pour traiter votre commande, soutenir votre expérience sur ce site web et pour d'autres raisons décrites dans notre politique de confidentialité.
                        </p>
                    </div>
                </div>

                {/* Billing Details (Now Second) */}
                <div className="checkout-section form-section">
                    <h2 className="section-title Détails">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Détails de facturation
                    </h2>

                    {user ? (
                        <form className="billing-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-field">
                                <label>Nom complet *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Votre nom et prénom"
                                    value={billingInfo.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Numéro WhatsApp *</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        style={{
                                            padding: '12px 15px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            width: '140px',
                                            paddingRight: '5px',
                                            textOverflow: 'ellipsis'
                                        }}
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
                                        name="localWhatsapp"
                                        placeholder="21 345 678"
                                        value={localWhatsapp}
                                        onChange={(e) => {
                                            setLocalWhatsapp(e.target.value);
                                            setBillingInfo(prev => ({ ...prev, whatsapp: selectedCountryCode + e.target.value }));
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '12px 15px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label style={{ marginBottom: '15px', display: 'block' }}>Mode de paiement *</label>
                                <div className="payment-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '15px',
                                    marginTop: '10px'
                                }}>
                                    {paymentModes.map((mode, index) => (
                                        <div
                                            key={index}
                                            className={`payment-mode-card ${billingInfo.paymentMode === mode.name ? 'active' : ''}`}
                                            onClick={() => setBillingInfo({ ...billingInfo, paymentMode: mode.name })}
                                            style={{
                                                padding: '20px 15px',
                                                border: billingInfo.paymentMode === mode.name ? '2.5px solid #0ea5e9' : '1px solid #e2e8f0',
                                                borderRadius: '16px',
                                                background: billingInfo.paymentMode === mode.name ? '#f0f9ff' : '#fff',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                gap: '12px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                boxShadow: billingInfo.paymentMode === mode.name ? '0 10px 15px -3px rgba(14, 165, 233, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                        >
                                            {billingInfo.paymentMode === mode.name && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: '#0ea5e9',
                                                    color: '#fff',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    ✓
                                                </div>
                                            )}
                                            <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {mode.logo ? (
                                                    <img src={mode.logo} alt={mode.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ fontSize: '32px' }}>💳</div>
                                                )}
                                            </div>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: billingInfo.paymentMode === mode.name ? '#0369a1' : '#1e293b'
                                            }}>
                                                {mode.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </form>
                    ) : (
                        <div className="login-alert">
                            <p>Veuillez vous connecter pour remplir vos informations de facturation.</p>
                            <Link to="/login" className="btn-login-alert">Se connecter</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div className="modal-overlay" style={{ zIndex: 2000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content review-modal" style={{ background: 'white', borderRadius: '24px', maxWidth: '450px', padding: '30px', width: '90%' }}>
                        <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Laisser un avis</h2>
                        <form onSubmit={handleReviewSubmit}>
                            {!user && (
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <h6 style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', margin: 0 }}>Votre Nom</h6>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={reviewForm.username}
                                        onChange={(e) => setReviewForm({ ...reviewForm, username: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <h6 style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', margin: 0 }}>Note</h6>
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

                            {/* Hidden Comment Field */}
                            {/* <div className="form-group" style={{ marginBottom: '20px' }}>
                                <h6 style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', margin: 0 }}>Votre Commentaire</h6>
                                <textarea
                                    className="form-input"
                                    style={{ height: '120px', resize: 'none', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div> */}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-confirm-order" disabled={isSubmittingReview} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <h6 style={{ margin: 0, fontSize: 'inherit', color: 'inherit', fontWeight: 'inherit' }}>{isSubmittingReview ? "Envoi..." : "Envoyer"}</h6>
                                </button>
                                <button type="button" className="btn-confirm-order" onClick={() => setReviewModalOpen(false)} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <h6 style={{ margin: 0, fontSize: 'inherit', color: 'inherit', fontWeight: 'inherit' }}>Annuler</h6>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
