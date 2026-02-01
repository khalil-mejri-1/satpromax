import React, { createContext, useState, useEffect } from 'react';

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

    // Categories State
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const fetchCategories = () => {
        setLoadingCategories(true);
        fetch('https://Satpromax.com/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data && data.data.categories) {
                    setCategories(data.data.categories);
                }
                setLoadingCategories(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setLoadingCategories(false);
            });
    };

    useEffect(() => {
        fetchCategories();
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
        loadingCategories,
        fetchCategories,
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
        clearCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};
