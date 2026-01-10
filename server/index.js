const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 3000;
const client = new OAuth2Client("1009149258614-fi43cus8mt3j8gcfh7d4jlnk1d05hajg.apps.googleusercontent.com");
const cors = require("cors");

// Models
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const GeneralSettings = require("./models/GeneralSettings");
const Review = require("./models/Review");

app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات
connectDB();

// Seeding Endpoint (Send all data to BD) 
// In a real app, this should be protected or separate script
app.post("/api/seed", async (req, res) => {
    try {
        const products = req.body.products;
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        await Product.deleteMany({}); // Clear existing products if needed, or simple add
        const savedProducts = await Product.insertMany(products);

        res.status(201).json({ message: "Products seeded successfully", count: savedProducts.length });
    } catch (error) {
        console.error("Seeding error:", error);
        res.status(500).json({ message: "Server error during seeding" });
    }
});

// Helper to slugify text
const slugify = (text) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

// Helper to generate a unique slug
const generateUniqueSlug = async (name, currentId = null) => {
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await Product.findOne({ slug, _id: { $ne: currentId } });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
};

// Migration endpoint to generate slugs for existing products
app.post("/api/migrate-slugs", async (req, res) => {
    try {
        const products = await Product.find({ slug: { $exists: false } });
        let updatedCount = 0;
        for (const product of products) {
            product.slug = await generateUniqueSlug(product.name, product._id);
            await product.save();
            updatedCount++;
        }
        res.status(200).json({ success: true, message: `${updatedCount} products updated with slugs` });
    } catch (error) {
        console.error("Migration error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all products (or filter by category)
app.get("/api/products", async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error("Error in /api/products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product by Category Slug and Product Slug
app.get("/api/products/slug/:category/:slug", async (req, res) => {
    try {
        // We find by slug. The category in URL is for SEO.
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new product
app.post("/api/products", async (req, res) => {
    try {
        const productData = req.body;
        if (productData.name) {
            productData.slug = await generateUniqueSlug(productData.name);
        }
        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json({ success: true, data: savedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update a product
app.put("/api/products/:id", async (req, res) => {
    try {
        const productData = req.body;
        if (productData.name) {
            productData.slug = await generateUniqueSlug(productData.name, req.params.id);
        }
        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});




// ... (previous routes)

// Register Endpoint
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Utilisateur déjà existant" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ success: true, message: "Inscription réussie" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check against Admin Credentials from Settings
        const settings = await GeneralSettings.findOne();
        const adminEmail = settings?.adminEmail || 'ferid123@admin.test';
        const adminPassword = settings?.adminPassword || '123456';

        if (email === adminEmail && password === adminPassword) {
            return res.status(200).json({
                success: true,
                message: "Connexion réussie (Admin)",
                user: { id: "admin", username: "Administrator", email: adminEmail, role: 'admin' }
            });
        }

        // Find regular user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Check password (plain text for simplicity as requested, use bcrypt in production)
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
        }

        res.status(200).json({
            success: true,
            message: "Connexion réussie",
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Google Login Endpoint
app.post("/api/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: "1009149258614-fi43cus8mt3j8gcfh7d4jlnk1d05hajg.apps.googleusercontent.com"
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if doesn't exist
            user = new User({
                username: name,
                email: email,
                password: Math.random().toString(36).slice(-10), // Random password for social logins
                role: 'user'
            });
            await user.save();
        }

        res.status(200).json({
            success: true,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ success: false, message: "Échec de l'authentification Google" });
    }
});

// --- USER MANAGEMENT ROUTES ---
// Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Update User Role
app.patch("/api/users/:id/role", async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.status(200).json({ success: true, message: "Rôle mis à jour", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World + Database Connected 🌍");
});

// Update General Settings (e.g. whatsappNumber)
app.put("/api/settings", async (req, res) => {
    try {
        let settings = await GeneralSettings.findOne();
        if (!settings) {
            settings = new GeneralSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});



// --- ORDER ROUTES ---


// Create Order
app.post("/api/orders", async (req, res) => {
    try {
        const { userId, userValidation, items, totalAmount, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Données de commande invalides" });
        }

        const newOrder = new Order({
            userId,
            userValidation,
            items,
            totalAmount,
            paymentMethod
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Commande créée avec succès", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Erreur lors de la création de la commande" });
    }
});

// Get User Orders
app.get("/api/orders/user/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get All Orders (Admin)
app.get("/api/orders", async (req, res) => {
    try {
        // Populate user info if needed, or just rely on userValidation snapshot
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'username email');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Update Order Status
app.patch("/api/orders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Commande non trouvée" });
        }

        res.status(200).json({ success: true, message: "Statut mis à jour", data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Delete a single order
app.delete("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Commande non trouvée" });
        }
        res.status(200).json({ success: true, message: "Commande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Delete all orders
app.delete("/api/orders", async (req, res) => {
    try {
        await Order.deleteMany({});
        res.status(200).json({ success: true, message: "Toutes les commandes ont été supprimées" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// --- GENERAL SETTINGS ROUTES ---


// Helper to get settings safely (bypassing mongoose validation if data is old)
const getSafeSettings = async () => {
    try {
        let settings = await GeneralSettings.findOne();
        if (settings) {
            // Even if findOne worked, verify paymentModes aren't strings
            if (settings.paymentModes && Array.isArray(settings.paymentModes)) {
                let changed = false;
                const fixed = settings.paymentModes.map(m => {
                    if (typeof m === 'string') {
                        changed = true;
                        return { name: m, logo: '' };
                    }
                    return m;
                });
                if (changed) {
                    settings.paymentModes = fixed;
                    await settings.save();
                }
            }
            return settings;
        }
    } catch (err) {
        console.warn("Schema mismatch detected, fixing settings raw...", err.message);
        const rawSettings = await GeneralSettings.collection.findOne();
        if (rawSettings) {
            // Fix paymentModes
            if (rawSettings.paymentModes && Array.isArray(rawSettings.paymentModes)) {
                rawSettings.paymentModes = rawSettings.paymentModes.map(m =>
                    typeof m === 'string' ? { name: m, logo: '' } : m
                );
            }
            // Fix deviceChoices (schema expects array of strings, but let's check)
            if (rawSettings.deviceChoices) {
                rawSettings.deviceChoices = Array.isArray(rawSettings.deviceChoices) ? rawSettings.deviceChoices : [];
            }

            await GeneralSettings.collection.replaceOne({ _id: rawSettings._id }, rawSettings);
            return await GeneralSettings.findById(rawSettings._id);
        }
    }

    // If still nothing, create new
    const settings = new GeneralSettings({
        paymentModes: [
            { name: 'D17', logo: '' },
            { name: 'Flouci', logo: '' },
            { name: 'Main à main', logo: '' }
        ],
        categories: [
            { name: 'Streaming', icon: '📺' },
            { name: 'IPTV Premium', icon: '⚡' },
            { name: 'Box Android', icon: '📦' },
            { name: 'Music', icon: '🎵' },
            { name: 'Gaming', icon: '🎮' },
            { name: 'Gift Card', icon: '🎁' },
            { name: 'Software', icon: '💻' }
        ]
    });
    await settings.save();
    return settings;
};

// Get Settings
app.get("/api/settings", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error in GET /api/settings:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});

// Add Category
app.post("/api/settings/categories", async (req, res) => {
    try {
        const { name, icon } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom de catégorie requis" });

        let settings = await getSafeSettings();
        if (!settings.categories) settings.categories = [];
        if (!settings.categories.some(c => c.name === name)) {
            settings.categories.push({ name, icon });
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error in POST /api/settings/categories:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});

// Remove Category
app.delete("/api/settings/categories/:category", async (req, res) => {
    try {
        const { category } = req.params; // this is the name
        let settings = await getSafeSettings();
        if (settings && settings.categories) {
            settings.categories = settings.categories.filter(c => c.name !== category);
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error in DELETE /api/settings/categories:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});

// Edit Category
app.put("/api/settings/categories/:oldCategory", async (req, res) => {
    try {
        const { oldCategory } = req.params; // old name
        const { newCategory, newIcon } = req.body;
        if (!newCategory) return res.status(400).json({ success: false, message: "Nouveau nom requis" });

        let settings = await getSafeSettings();
        if (settings && settings.categories) {
            const index = settings.categories.findIndex(c => c.name === oldCategory);
            if (index !== -1) {
                settings.categories[index].name = newCategory;
                if (newIcon !== undefined) settings.categories[index].icon = newIcon;
                await settings.save();
            }
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error in PUT /api/settings/categories:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});

// Add Payment Mode
app.post("/api/settings/payment-modes", async (req, res) => {
    try {
        const { name, logo } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });

        let settings = await getSafeSettings();
        if (!settings.paymentModes) settings.paymentModes = [];

        // Check if name already exists (handling potential string types in array just in case)
        const exists = settings.paymentModes.some(m => m.name === name);

        if (!exists) {
            settings.paymentModes.push({ name, logo });
            await settings.save();
        }

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error in POST /api/settings/payment-modes:", error);
        res.status(500).json({ success: false, message: "Erreur serveur: " + error.message });
    }
});

// Remove Payment Mode
app.delete("/api/settings/payment-modes/:mode", async (req, res) => {
    try {
        const { mode } = req.params; // this is the name
        let settings = await GeneralSettings.findOne();
        if (settings) {
            settings.paymentModes = settings.paymentModes.filter(m => m.name !== mode);
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Add Device Choice
// Add Device Choice
app.post("/api/settings/device-choices", async (req, res) => {
    try {
        const { choice } = req.body;
        if (!choice) return res.status(400).json({ success: false, message: "Choice required" });

        let settings = await GeneralSettings.findOne();
        // Create if not exists
        if (!settings) {
            settings = new GeneralSettings({ deviceChoices: [choice] });
        } else {
            // Ensure array exists
            if (!settings.deviceChoices) settings.deviceChoices = [];

            if (!settings.deviceChoices.includes(choice)) {
                settings.deviceChoices.push(choice);
            }
        }
        await settings.save();

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Remove Device Choice
app.delete("/api/settings/device-choices/:choice", async (req, res) => {
    try {
        const { choice } = req.params;
        let settings = await GeneralSettings.findOne();
        if (settings) {
            if (settings.deviceChoices) {
                settings.deviceChoices = settings.deviceChoices.filter(c => c !== choice);
                await settings.save();
            }
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// --- REVIEW ROUTES ---


// Get all approved reviews for home page
app.get("/api/reviews/approved", async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all reviews for admin
app.get("/api/reviews", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Submit a new review
app.post("/api/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update review status (Approve/Reject)
app.put("/api/reviews/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete a review
app.delete("/api/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Endpoint
app.get("/api/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(200).json({ categories: [], products: [] });
        }

        // Fuzzy search regex: "sarng" -> /s.*a.*r.*n.*g/i
        const fuzzyPattern = q.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
        const regex = new RegExp(fuzzyPattern, "i");

        // Search Categories
        const settings = await getSafeSettings();
        const categories = (settings.categories || []).filter(cat =>
            regex.test(typeof cat === 'object' ? cat.name : cat)
        );

        // Search Products
        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
                { category: { $regex: regex } }
            ]
        }).limit(5);

        res.status(200).json({ success: true, categories, products });
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ success: false, message: "Search failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
