
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require("nodemailer");

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
const Guide = require("./models/Guide");
const GuideInquiry = require("./models/GuideInquiry");
const ContactMessage = require("./models/ContactMessage");
const SupportTicket = require("./models/SupportTicket");

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
            // Use case-insensitive regex for category matching to handle slug/casing mismatches
            // Escape special regex characters just in case
            const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.category = { $regex: new RegExp(`^${escapedCategory}$`, 'i') };
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

// Forgot Password - Send Code
app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');

        let user = await User.findOne({ email: { $regex: emailRegex } });
        let isGeneralAdmin = false;
        let settings = null;

        if (!user) {
            // Check if it's the admin email in settings
            settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) {
                isGeneralAdmin = true;
            } else {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }
        }

        // Generate 8 digit code
        const resetCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        const expires = Date.now() + 60000; // 1 minute

        if (isGeneralAdmin && settings) {
            settings.resetCode = resetCode;
            settings.resetCodeExpires = expires;
            await settings.save();
        } else if (user) {
            user.resetCode = resetCode;
            user.resetCodeExpires = expires;
            await user.save();
        }

        // Send Email (Mocking if no creds, but structure is here)
        // Note: For this to actually work, valid credentials are needed in transporter
        // Send Email
        // Send Email using Settings
        // Ensure settings are loaded (fetched earlier in logic)
        if (!settings) settings = await GeneralSettings.findOne();

        const senderEmail = settings?.senderEmail || 'kmejri57@gmail.com';
        const senderPassword = settings?.senderPassword || 'msncmujsbjqnszxp';

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPassword
            }
        });

        const mailOptions = {
            from: senderEmail,
            to: email,
            subject: 'Code de réinitialisation de mot de passe',
            text: `Votre code de réinitialisation est : ${resetCode}. Il expire dans 1 minute.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        } catch (emailError) {
            console.log("Email error:", emailError.message);
            console.log("FALLBACK CODE:", resetCode);
        }

        // Always log for development as requested
        console.log(`SIMULATION EMAIL: Code sent to ${email}: ${resetCode}`);

        res.status(200).json({ success: true, message: "Code envoyé (vérifiez votre email)" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Verify Code
app.post("/api/auth/verify-code", async (req, res) => {
    try {
        const { email, code } = req.body;
        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');

        // Check User
        let target = await User.findOne({ email: { $regex: emailRegex } });

        // If not user, Check Admin Settings
        if (!target) {
            const settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) {
                target = settings;
            }
        }

        if (!target) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        if (target.resetCode !== code) {
            return res.status(400).json({ success: false, message: "Code incorrect" });
        }

        if (Date.now() > target.resetCodeExpires) {
            return res.status(400).json({ success: false, message: "Le code a expiré" });
        }

        res.status(200).json({ success: true, message: "Code valide" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères" });
        }

        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');

        // Check User
        let user = await User.findOne({ email: { $regex: emailRegex } });
        let isGeneralAdmin = false;
        let settings = null;

        if (!user) {
            // Check Admin
            settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) {
                isGeneralAdmin = true;
            } else {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }
        }

        const target = isGeneralAdmin ? settings : user;

        if (target.resetCode !== code || Date.now() > target.resetCodeExpires) {
            return res.status(400).json({ success: false, message: "Code invalide ou expiré" });
        }

        if (isGeneralAdmin) {
            target.adminPassword = newPassword;
        } else {
            target.password = newPassword;
        }

        target.resetCode = undefined;
        target.resetCodeExpires = undefined;
        await target.save();

        res.status(200).json({ success: true, message: "Mot de passe modifié avec succès" });

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
                role: 'client'
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

        const validUserId = (userId === "admin" || !userId) ? null : userId;

        const newOrder = new Order({
            userId: validUserId,
            userValidation,
            items,
            totalAmount,
            paymentMethod
        });

        await newOrder.save();

        // Send Email Notification
        try {
            // Fetch settings for dynamic credentials
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'kmejri57@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'msncmujsbjqnszxp';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: senderEmail,
                    pass: senderPass
                }
            });

            const itemsHtml = items.map(item => `
                <li>
                    <strong>${item.name}</strong><br>
                    Quantité: ${item.quantity}<br>
                    Prix: ${item.price}<br>
                    ${item.deviceChoice ? `Appareil: ${item.deviceChoice}<br>` : ''}
                    ${item.receiverSerial ? `S/N Récepteur: ${item.receiverSerial}<br>` : ''}
                </li>
            `).join('');

            const mailOptions = {
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouvelle Commande - ${newOrder._id}`,
                html: `
                    <h2>Nouvelle commande reçue !</h2>
                    <h3>Détails de la commande :</h3>
                    <ul>
                        ${itemsHtml}
                    </ul>
                    <h3>Total : ${totalAmount} DT</h3>
                    <hr>
                    <h3>Informations Client :</h3>
                    <p><strong>Nom :</strong> ${userValidation.name}</p>
                    <p><strong>WhatsApp :</strong> ${userValidation.whatsapp}</p>
                    <p><strong>Paiement :</strong> ${paymentMethod}</p>
                    <br>
                    <p>Commande ID : ${newOrder._id}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Order notification email sent to mejrik1888@gmail.com");

        } catch (emailError) {
            console.error("Error sending order email:", emailError);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json({ success: true, message: "Commande créée avec succès", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Erreur lors de la création de la commande" });
    }
});

// Get User Orders
app.get("/api/orders/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // If it's the special 'admin' ID or not a valid MongoDB ObjectId, it won't have orders linked this way
        if (userId === "admin" || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
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



            // Verify categories aren't strings
            if (settings.categories && Array.isArray(settings.categories)) {
                let changed = false;
                const fixed = settings.categories.map(c => {
                    if (typeof c === 'string') {
                        changed = true;
                        return { name: c, icon: '', slug: slugify(c), title: '', description: '' };
                    }
                    if (!c.slug) {
                        changed = true;
                        c.slug = slugify(c.name);
                    }
                    return c;
                });
                if (changed) {
                    settings.categories = fixed;
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

            // Fix categories
            if (rawSettings.categories && Array.isArray(rawSettings.categories)) {
                rawSettings.categories = rawSettings.categories.map(c =>
                    typeof c === 'string' ? { name: c, icon: '' } : c
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
            { name: 'Streaming', icon: '📺', slug: 'streaming', title: 'Streaming', description: "Découvrez les meilleures offres de streaming en Tunisie : Netflix, Shahid VIP, OSN+, YouTube Premium et plus !" },
            { name: 'IPTV Premium', icon: '⚡', slug: 'iptv-sharing', title: 'Abonnement IPTV', description: "Profitez d'une large sélection d'abonnements IPTV et Sharing pour toutes vos chaînes préférées." },
            { name: 'Box Android', icon: '📦', slug: 'box-android-recepteur', title: 'Box Android & Recepteur', description: "Transformez votre TV avec nos Box Android et Récepteurs dernière génération." },
            { name: 'Music', icon: '🎵', slug: 'music', title: 'Musique', description: "Écoutez votre musique préférée sans interruption avec nos abonnements premium." },
            { name: 'Gaming', icon: '🎮', slug: 'gaming', title: 'Gaming', description: "Cartes cadeaux et abonnements pour PSN, Xbox, Steam et plus." },
            { name: 'Gift Card', icon: '🎁', slug: 'gift-card', title: 'Cartes Cadeaux', description: "Offrez le cadeau parfait avec nos cartes cadeaux digitales." },
            { name: 'Software', icon: '💻', slug: 'software', title: 'Logiciels', description: "Logiciels et outils de productivité pour professionnels et particuliers." }
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
        const { name, icon, title, description, slug, metaTitle, metaDescription, keywords } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom de catégorie requis" });

        let settings = await getSafeSettings();
        if (!settings.categories) settings.categories = [];
        if (!settings.categories.some(c => c.name === name)) {
            settings.categories.push({
                name,
                icon,
                title: title || '',
                description: description || '',
                slug: slug || slugify(name),
                metaTitle: metaTitle || '',
                metaDescription: metaDescription || '',
                keywords: keywords || ''
            });
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
        const { newCategory, newIcon, newTitle, newDescription, newSlug, newMetaTitle, newMetaDescription, newKeywords } = req.body;
        if (!newCategory) return res.status(400).json({ success: false, message: "Nouveau nom requis" });

        let settings = await getSafeSettings();
        if (settings && settings.categories) {
            const index = settings.categories.findIndex(c => c.name === oldCategory);
            if (index !== -1) {
                settings.categories[index].name = newCategory;
                if (newIcon !== undefined) settings.categories[index].icon = newIcon;
                if (newTitle !== undefined) settings.categories[index].title = newTitle;
                if (newDescription !== undefined) settings.categories[index].description = newDescription;
                if (newSlug !== undefined) settings.categories[index].slug = newSlug;
                if (newMetaTitle !== undefined) settings.categories[index].metaTitle = newMetaTitle;
                if (newMetaDescription !== undefined) settings.categories[index].metaDescription = newMetaDescription;
                if (newKeywords !== undefined) settings.categories[index].keywords = newKeywords;
                settings.markModified('categories'); // Necessary for Mixed types
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
        res.status(200).json({ success: true, message: "Mode de paiement supprimé" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// --- SUPPORT MANAGEMENT ROUTES ---

// Get all issue types & fields
app.get("/api/support/config", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        res.status(200).json({
            success: true,
            types: settings.supportIssueTypes || [],
            fields: settings.supportFormFields || [],
            heroImage: settings.supportHeroImage || "/images/support-hero-bg.png"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Update Config (Hero Image)
app.put("/api/support/config", async (req, res) => {
    try {
        const { heroImage } = req.body;
        let settings = await getSafeSettings();
        if (heroImage !== undefined) settings.supportHeroImage = heroImage;
        await settings.save();
        res.status(200).json({ success: true, message: "Configuration mise à jour", heroImage: settings.supportHeroImage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Update Fields
app.put("/api/support/fields", async (req, res) => {
    try {
        const { fields } = req.body;
        let settings = await getSafeSettings();
        settings.supportFormFields = fields;
        await settings.save();
        res.status(200).json({ success: true, message: "Champs mis à jour", data: settings.supportFormFields });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get all issue types (Keep for backward compatibility mostly)
app.get("/api/support/types", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        res.status(200).json({ success: true, data: settings.supportIssueTypes || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Add issue type
app.post("/api/support/types", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Le nom est requis" });

        let settings = await getSafeSettings();
        if (!settings.supportIssueTypes) settings.supportIssueTypes = [];

        // Check duplicate
        if (!settings.supportIssueTypes.some(t => t.name === name)) {
            settings.supportIssueTypes.push({ name });
            await settings.save();
        }

        res.status(200).json({ success: true, data: settings.supportIssueTypes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Delete issue type
app.delete("/api/support/types/:name", async (req, res) => {
    try {
        const { name } = req.params;
        let settings = await getSafeSettings();

        if (settings.supportIssueTypes) {
            settings.supportIssueTypes = settings.supportIssueTypes.filter(t => t.name !== name);
            await settings.save();
        }

        res.status(200).json({ success: true, data: settings.supportIssueTypes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Create Support Ticket
app.post("/api/support/tickets", async (req, res) => {
    try {
        const { formDetails, issueType, message } = req.body;

        if (!issueType || !message) {
            return res.status(400).json({ success: false, message: "Le type et le message sont requis" });
        }

        const newTicket = new SupportTicket({
            formDetails: formDetails || [],
            issueType,
            message
        });

        await newTicket.save();

        // Email Notification
        try {
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'kmejri57@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'msncmujsbjqnszxp';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: senderEmail,
                    pass: senderPass
                }
            });

            // Build Details HTML
            let detailsHtml = '';
            if (formDetails && Array.isArray(formDetails)) {
                detailsHtml = formDetails.map(f => `<p><strong>${f.label}:</strong> ${f.value}</p>`).join('');
            }

            const mailOptions = {
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouveau Ticket Support - ${issueType}`,
                html: `
                    <h2>Nouveau ticket de support reçu</h2>
                    ${detailsHtml}
                    <p><strong>Type de Problème:</strong> ${issueType}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <br>
                    <p>ID Ticket: ${newTicket._id}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Support notification email sent");

        } catch (emailError) {
            console.error("Error sending support email:", emailError);
        }

        res.status(201).json({ success: true, message: "Ticket envoyé avec succès" });

    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get All Tickets (Admin)
app.get("/api/support/tickets", async (req, res) => {
    try {
        const tickets = await SupportTicket.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Delete Ticket
app.delete("/api/support/tickets/:id", async (req, res) => {
    try {
        await SupportTicket.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Ticket supprimé" });
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

// --- RESOLUTIONS ROUTES ---
app.post("/api/settings/resolutions", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });

        let settings = await getSafeSettings();
        if (!settings.resolutions) settings.resolutions = [];

        // Check if exists
        const exists = settings.resolutions.some(r => r.name === name);
        if (!exists) {
            settings.resolutions.push({ name, image });
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/resolutions/:name", async (req, res) => {
    try {
        const { name } = req.params;
        let settings = await getSafeSettings();
        if (settings && settings.resolutions) {
            settings.resolutions = settings.resolutions.filter(r => r.name !== name);
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// --- REGIONS ROUTES ---
app.post("/api/settings/regions", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });

        let settings = await getSafeSettings();
        if (!settings.regions) settings.regions = [];

        // Check if exists
        const exists = settings.regions.some(r => r.name === name);
        if (!exists) {
            settings.regions.push({ name, image });
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/regions/:name", async (req, res) => {
    try {
        const { name } = req.params;
        let settings = await getSafeSettings();
        if (settings && settings.regions) {
            settings.regions = settings.regions.filter(r => r.name !== name);
            await settings.save();
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
// Submit a new review
app.post("/api/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();

        // Send Email Notification
        try {
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'kmejri57@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'msncmujsbjqnszxp';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: senderEmail,
                    pass: senderPass
                }
            });

            const mailOptions = {
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouvel Avis Reçu - ${review.username}`,
                html: `
                    <h2>Nouvel avis sur le site !</h2>
                    <p><strong>Utilisateur :</strong> ${review.username}</p>
                    <p><strong>Note :</strong> ${review.rating}/5</p>
                    <p><strong>Commentaire :</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
                        ${review.comment}
                    </blockquote>
                    <p>Statut : ${review.status === 'approved' ? 'Approuvé' : 'En attente'}</p>
                    <br>
                    <p>Connectez-vous à l'administration pour gérer cet avis.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Review notification email sent.");

        } catch (emailError) {
            console.error("Error sending review email:", emailError);
        }

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
// Search Endpoint
app.get("/api/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json({ success: true, data: { categories: [], products: [] } });
        }

        const searchTerm = q.trim();

        // Escape special regex chars
        const escapeRegex = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        // 1. Create a "Space/Char-Insensitive" Regex
        // Matches "Orca promax" against "Orca - Pro Max" or "Orca.Pro.Max"
        const cleanTerm = searchTerm.replace(/\s+/g, '');
        const escapedCleanTerm = escapeRegex(cleanTerm);
        // matches zero or more whitespace OR non-word characters (like - . /)
        const loosePattern = escapedCleanTerm.split('').join('[\\s\\W]*');
        const searchRegex = new RegExp(loosePattern, 'i');

        // Also keep exact term for scoring
        const exactTermLower = searchTerm.toLowerCase();

        // Fetch products matching regex
        let products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        });

        // 1. Filter and Score Products
        products = products.map(p => {
            const nameLower = p.name ? p.name.toLowerCase() : "";
            let score = 0;

            // Tier 1: Exact Phrase Match (User input exactly inside name)
            if (nameLower.includes(exactTermLower)) {
                score += 1000;
            }
            // Tier 2: Contiguous Regex Match in Name
            else if (searchRegex.test(p.name)) {
                score += 500;
            }
            // Tier 3: Description/Category Match Only
            else {
                score += 100;
            }

            return { product: p, score, length: nameLower.length };
        });

        // Sort: Score DESC, then Length DESC
        products.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }
            return b.length - a.length;
        });

        // Limit results (after sort)
        const sortedProducts = products.map(item => item.product).slice(0, 10);

        // Fetch settings for categories logic search (standard)
        const settings = await getSafeSettings();
        const allCategories = settings ? settings.categories : [];
        const matchedCategories = new Set();

        // Add categories from products
        sortedProducts.forEach(p => {
            if (p.category) matchedCategories.add(p.category);
        });

        // Add matching categories from settings
        const fuzzyPattern = searchTerm.split('').join('.*');
        const catRegex = new RegExp(fuzzyPattern, 'i');

        allCategories.forEach(cat => {
            const catName = typeof cat === 'object' ? cat.name : cat;
            if (catName && catRegex.test(catName)) {
                matchedCategories.add(catName);
            }
        });

        res.status(200).json({
            success: true,
            categories: Array.from(matchedCategories),
            products: sortedProducts
        });

    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ success: false, message: "Search failed" });
    }
});




app.get('/share/produit/:category/:slug', async (req, res) => {
    try {
        const { category, slug } = req.params;
        const userAgent = req.get('User-Agent') || '';
        // Expanded bot list
        const isBot = /facebook|facebot|externalhit|twitterbot|pinterest|linkedinbot|whatsapp|telegram|discord|googlebot|bingbot|yandex|slackbot|applebot/i.test(userAgent);

        console.log(`[SHARE DEBUG] Slug=${slug}, UA=${userAgent}, IsBot=${isBot}`);

        // Find by slug only for reliability (slugs are unique)
        const product = await Product.findOne({ slug: slug });

        if (!product) {
            console.log("[SHARE DEBUG] Product not found");
            return res.status(404).send('<h1>Produit introuvable</h1>');
        }

        const realProductUrl = `http://localhost:3000/produit/${encodeURIComponent(category)}/${slug}`;
        const shareApiUrl = `https://api.satpromax.com/share/produit/${encodeURIComponent(category)}/${slug}`;

        let imageUrl = product.image || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `http://localhost:3000${imageUrl}`;
        }

        // Clean description
        const cleanDesc = product.description
            ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 200)
            : `Découvrez ${product.name} sur SatProMax`;

        res.set('Content-Type', 'text/html');
        res.send(`<!DOCTYPE html>
<html lang="fr" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>${product.name}</title>
    
    <!-- Open Graph Data -->
    <meta property="og:title" content="${product.name}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${shareApiUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />
    <meta property="og:description" content="${cleanDesc}" />
    <meta property="og:site_name" content="SatProMax" />
    <meta property="fb:app_id" content="966242223397117" />
    
    <!-- Twitter Card Data -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${product.name}" />
    <meta name="twitter:description" content="${cleanDesc}" />
    <meta name="twitter:image" content="${imageUrl}" />

    ${!isBot ? `<meta http-equiv="refresh" content="0; url=${realProductUrl}" />` : ''}
</head>
<body>
    ${isBot
                ? `<h1>${product.name}</h1><img src="${imageUrl}" alt="${product.name}" /><p>${cleanDesc}</p>`
                : '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">Redirection en cours...</div>'
            }
    
    <script>
        ${!isBot ? `window.location.replace("${realProductUrl}");` : ''}
    </script>
</body>
</html>`);

    } catch (error) {
        console.error("[SHARE ERROR]", error);
        res.status(500).send("Server Error");
    }
});

// --- GUIDE / BLOG ROUTES ---

// Get all guides
app.get("/api/guides", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const guides = await Guide.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get single guide by slug
app.get("/api/guides/slug/:slug", async (req, res) => {
    try {
        const guide = await Guide.findOne({ slug: req.params.slug });
        if (!guide) return res.status(404).json({ success: false, message: "Article non trouvé" });
        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Create Guide (Admin)
app.post("/api/guides", async (req, res) => {
    try {
        const { title, content, sections, excerpt, image, category, metaTitle, metaDescription, keywords } = req.body;
        if (!title) return res.status(400).json({ success: false, message: "Titre requis" });

        const slug = slugify(title) + '-' + Date.now(); // Ensure unique slug

        const newGuide = new Guide({
            title,
            slug,
            content,
            sections,
            excerpt,
            image,
            category,
            metaTitle,
            metaDescription,
            keywords
        });

        await newGuide.save();
        res.status(201).json({ success: true, data: newGuide });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Update Guide (Admin)
app.put("/api/guides/:id", async (req, res) => {
    try {
        const updateData = req.body;
        // If title changed, we might want to update slug, but usually better to keep it or handle redirects.
        // For simplicity, let's just update fields.

        const guide = await Guide.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!guide) return res.status(404).json({ success: false, message: "Article non trouvé" });

        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});


// --- GUIDE INQUIRIES (QUESTION ABOUT ARTICLES) ---

// Post an inquiry
app.post("/api/guide-inquiries", async (req, res) => {
    try {
        const { name, whatsapp, question, articleTitle, articleSlug } = req.body;
        if (!name || !whatsapp || !question) {
            return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires" });
        }
        const newInquiry = new GuideInquiry({ name, whatsapp, question, articleTitle, articleSlug });
        await newInquiry.save();
        res.status(201).json({ success: true, message: "Message envoyé avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get all inquiries (Admin)
app.get("/api/guide-inquiries", async (req, res) => {
    try {
        const inquiries = await GuideInquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Delete inquiry (Admin)
app.delete("/api/guide-inquiries/:id", async (req, res) => {
    try {
        await GuideInquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Demande supprimée" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});


// --- CONTACT MESSAGES ---

// Post a contact message
app.post("/api/contact-messages", async (req, res) => {
    try {
        const { name, whatsapp, subject, message } = req.body;
        if (!name || !whatsapp || !subject || !message) {
            return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires" });
        }
        const newMessage = new ContactMessage({ name, whatsapp, subject, message });
        await newMessage.save();

        // Send Email Notification
        try {
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'satpromax2026@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'ywjatvegygdylvth';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: senderEmail,
                    pass: senderPass
                }
            });

            const mailOptions = {
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouveau Message Contact - ${subject}`,
                html: `
                    <h2>Nouveau message depuis la page Contact</h2>
                    <p><strong>Nom :</strong> ${name}</p>
                    <p><strong>WhatsApp :</strong> ${whatsapp}</p>
                    <p><strong>Sujet :</strong> ${subject}</p>
                    <br>
                    <p><strong>Message :</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
                        ${message}
                    </blockquote>
                    <br>
                    <p>Connectez-vous à l'administration pour répondre.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Contact message notification email sent.");

        } catch (emailError) {
            console.error("Error sending contact email:", emailError);
        }

        res.status(201).json({ success: true, message: "Message envoyé avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Get all messages (Admin)
app.get("/api/contact-messages", async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Mark as read (Admin)
app.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Delete message (Admin)
app.delete("/api/contact-messages/:id", async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
