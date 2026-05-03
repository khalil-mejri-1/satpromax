import React, { createContext, useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
    // Lazy initialize to prevent overwriting localStorage on initial render
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('cartItems');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error parsing cartItems from localStorage", error);
            return [];
        }
    });

    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const stored = localStorage.getItem('wishlistItems');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error parsing wishlistItems from localStorage", error);
            return [];
        }
    });

    // Aggregated App Data State
    const [homeData, setHomeData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingAppData, setLoadingAppData] = useState(true);
    const [settings, setSettings] = useState(null);
    const [customButtons, setCustomButtons] = useState([]);

    const getButtonText = (btnId, defaultText) => {
        if (!customButtons || customButtons.length === 0) return defaultText;
        const btn = customButtons.find(b => b.id === btnId);
        return (btn && btn.customText) ? btn.customText : defaultText;
    };

    const initAppData = async () => {
        setLoadingAppData(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/home-data`);
            const data = await res.json();
            
            if (data.success && data.data) {
                const payload = data.data;
                setHomeData(payload);
                setSettings(payload.settings);
                setCategories(payload.settings.categories || []);
                setCustomButtons(payload.settings.customButtons || []);

                // Apply global styles (Optimization: only once)
                const s = payload.settings;
                if (s.buttonColor) document.documentElement.style.setProperty('--button-bg', s.buttonColor);
                if (s.buttonTextColor) document.documentElement.style.setProperty('--button-text', s.buttonTextColor);

                // Inject Custom Button Styles
                if (s.customButtons && Array.isArray(s.customButtons)) {
                    let css = '';
                    s.customButtons.forEach(btn => {
                        if (btn.selector) {
                            let backgroundStyle = '';
                            if (btn.isGradient) {
                                backgroundStyle = `background: linear-gradient(${btn.gradientAngle || 45}deg, ${btn.gradientColor1}, ${btn.gradientColor2}) !important;`;
                            } else if (btn.backgroundColor) {
                                backgroundStyle = `background: ${btn.backgroundColor} !important;`;
                            }

                            if (backgroundStyle || btn.color) {
                                css += `${btn.selector} { 
                                    ${backgroundStyle} 
                                    ${btn.color ? `color: ${btn.color} !important;` : ''} 
                                    border-color: transparent !important;
                                    transition: all 0.3s ease !important;
                                }\n`;
                            }
                        }
                    });

                    if (css) {
                        let styleTag = document.getElementById('dynamic-buttons-style');
                        if (!styleTag) {
                            styleTag = document.createElement('style');
                            styleTag.id = 'dynamic-buttons-style';
                            document.head.appendChild(styleTag);
                        }
                        styleTag.innerHTML = css;
                    }
                }
            }
        } catch (err) {
            console.error("Error initializing app data:", err);
        } finally {
            setLoadingAppData(false);
        }
    };

    useEffect(() => {
        initAppData();
    }, []);

    // Save to local storage whenever cart or wishlist changes
    // We can merge these or keep separate. 
    // Important: The initial render will already have the correct state, so saving it back is fine.
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToCart = (product, quantity = 1) => {
        // Ensure we have a valid ID. Support MongoDB _id, sku, or fallback to name for mocks
        const productId = product.id || product._id || product.sku || product.name;
        const productToAdd = { ...product, id: productId };

        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === productId);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...productToAdd, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartItemQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const addToWishlist = (product) => {
        const productId = product.id || product._id || product.sku || product.name;
        const productToAdd = { ...product, id: productId };

        setWishlistItems((prev) => {
            if (prev.find((item) => item.id === productId)) return prev;
            return [...prev, productToAdd];
        });
    };

    const addAllToCart = (products) => {
        setCartItems((prev) => {
            let updatedCart = [...prev];
            products.forEach(product => {
                const existingIndex = updatedCart.findIndex(item => item.id === product.id);
                if (existingIndex >= 0) {
                    updatedCart[existingIndex] = {
                        ...updatedCart[existingIndex],
                        quantity: updatedCart[existingIndex].quantity + 1
                    };
                } else {
                    updatedCart.push({ ...product, quantity: 1 });
                }
            });
            return updatedCart;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            // Assuming price is a string like "100 DT" or number. We need to parse it.
            // Adjusting parsing logic based on potential data formats.
            let price = 0;
            if (typeof item.price === 'string') {
                price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            } else {
                price = item.price;
            }
            return total + price * item.quantity;
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    const clearCart = () => {
        setCartItems([]);
    };


    const updateCartItemDevice = (productId, device) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, selectedDevice: device } : item
            )
        );
    };

    const contextValue = {
        cartItems,
        wishlistItems,
        categories,
        settings,
        homeData,
        loadingAppData,
        initAppData,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemDevice,
        addToWishlist,
        addAllToCart,
        removeFromWishlist,
        getCartTotal,
        getCartCount,
        getWishlistCount,
        clearCart,
        customButtons, // Consumed by components to check for custom text
        getButtonText // Helper function
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};
