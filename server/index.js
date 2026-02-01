const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const CLIENT_DIST = path.join(__dirname, "../client/dist");
const INDEX_HTML = path.join(CLIENT_DIST, "index.html");
const client = new OAuth2Client("1009149258614-fi43cus8mt3j8gcfh7d4jlnk1d05hajg.apps.googleusercontent.com");

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

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

// --- UTILS ---
const slugify = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
};

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

// --- API ROUTES (MUST COME FIRST) ---

// Seeding
app.post("/api/seed", async (req, res) => {
    try {
        const products = req.body.products;
        if (!products || !Array.isArray(products)) return res.status(400).json({ message: "Invalid product data" });
        await Product.deleteMany({});
        const savedProducts = await Product.insertMany(products);
        res.status(201).json({ message: "Products seeded successfully", count: savedProducts.length });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/migrate-slugs", async (req, res) => {
    try {
        const products = await Product.find({ slug: { $exists: false } });
        let updatedCount = 0;
        for (const product of products) {
            product.slug = await generateUniqueSlug(product.name, product._id);
            await product.save();
            updatedCount++;
        }
        res.status(200).json({ success: true, message: `${updatedCount} products updated` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Products
app.get("/api/products", async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.category = { $regex: new RegExp(`^${escapedCategory}$`, 'i') };
        }
        const products = await Product.find(query);
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: "Product not found" });
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/api/products/slug/:category/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const productData = req.body;
        if (productData.name) productData.slug = await generateUniqueSlug(productData.name);
        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json({ success: true, data: savedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const productData = req.body;
        if (productData.name) productData.slug = await generateUniqueSlug(productData.name, req.params.id);
        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Auth
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Utilisateur déjà existant" });
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Inscription réussie" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
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

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        if (user.password !== password) return res.status(400).json({ success: false, message: "Mot de passe incorrect" });

        res.status(200).json({
            success: true,
            message: "Connexion réussie",
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');
        let user = await User.findOne({ email: { $regex: emailRegex } });
        let isGeneralAdmin = false;
        let settings = null;

        if (!user) {
            settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) isGeneralAdmin = true;
            else return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        const resetCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        const expires = Date.now() + 60000;

        if (isGeneralAdmin && settings) {
            settings.resetCode = resetCode;
            settings.resetCodeExpires = expires;
            await settings.save();
        } else if (user) {
            user.resetCode = resetCode;
            user.resetCodeExpires = expires;
            await user.save();
        }

        if (!settings) settings = await GeneralSettings.findOne();
        const senderEmail = settings?.senderEmail || 'kmejri57@gmail.com';
        const senderPassword = settings?.senderPassword || 'msncmujsbjqnszxp';

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: senderEmail, pass: senderPassword }
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
        }
        console.log(`SIMULATION EMAIL: Code sent to ${email}: ${resetCode}`);
        res.status(200).json({ success: true, message: "Code envoyé" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/auth/verify-code", async (req, res) => {
    try {
        const { email, code } = req.body;
        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');
        let target = await User.findOne({ email: { $regex: emailRegex } });

        if (!target) {
            const settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) target = settings;
        }

        if (!target) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        if (target.resetCode !== code) return res.status(400).json({ success: false, message: "Code incorrect" });
        if (Date.now() > target.resetCodeExpires) return res.status(400).json({ success: false, message: "Le code a expiré" });

        res.status(200).json({ success: true, message: "Code valide" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères" });

        const normalizedEmail = email.trim();
        const emailRegex = new RegExp(`^${normalizedEmail}$`, 'i');
        let user = await User.findOne({ email: { $regex: emailRegex } });
        let isGeneralAdmin = false;
        let settings = null;

        if (!user) {
            settings = await GeneralSettings.findOne();
            if (settings && settings.adminEmail && emailRegex.test(settings.adminEmail)) isGeneralAdmin = true;
            else return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        const target = isGeneralAdmin ? settings : user;
        if (target.resetCode !== code || Date.now() > target.resetCodeExpires) return res.status(400).json({ success: false, message: "Code invalide ou expiré" });

        if (isGeneralAdmin) target.adminPassword = newPassword;
        else target.password = newPassword;

        target.resetCode = undefined;
        target.resetCodeExpires = undefined;
        await target.save();

        res.status(200).json({ success: true, message: "Mot de passe modifié avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: "1009149258614-fi43cus8mt3j8gcfh7d4jlnk1d05hajg.apps.googleusercontent.com"
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ username: name, email, password: Math.random().toString(36).slice(-10), role: 'client' });
            await user.save();
        }

        res.status(200).json({ success: true, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Échec authentification Google" });
    }
});

// Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.patch("/api/users/:id/role", async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.status(200).json({ success: true, message: "Rôle mis à jour", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Settings
const getSafeSettings = async () => {
    try {
        let settings = await GeneralSettings.findOne();
        if (settings) {
            if (settings.paymentModes && Array.isArray(settings.paymentModes) && settings.paymentModes.some(m => typeof m === 'string')) {
                settings.paymentModes = settings.paymentModes.map(m => typeof m === 'string' ? { name: m, logo: '' } : m);
                await settings.save();
            }
            if (settings.categories && Array.isArray(settings.categories) && settings.categories.some(c => typeof c === 'string')) {
                settings.categories = settings.categories.map(c => typeof c === 'string' ? { name: c, icon: '', slug: slugify(c) } : c);
                await settings.save();
            }
            return settings;
        }
    } catch (err) {
        const rawSettings = await GeneralSettings.collection.findOne();
        if (rawSettings) {
            await GeneralSettings.collection.replaceOne({ _id: rawSettings._id }, rawSettings);
            return await GeneralSettings.findById(rawSettings._id);
        }
    }

    const settings = new GeneralSettings({
        paymentModes: [{ name: 'D17', logo: '' }, { name: 'Flouci', logo: '' }, { name: 'Main à main', logo: '' }],
        categories: [
            { name: 'Streaming', icon: '📺', slug: 'streaming', title: 'Streaming', description: "Offres Streaming" },
            { name: 'IPTV Premium', icon: '⚡', slug: 'iptv-sharing', title: 'IPTV', description: "Offres IPTV" }
        ]
    });
    await settings.save();
    return settings;
};

app.get("/api/settings", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.put("/api/settings", async (req, res) => {
    try {
        let settings = await GeneralSettings.findOne();
        if (!settings) settings = new GeneralSettings(req.body);
        else Object.assign(settings, req.body);
        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.post("/api/settings/categories", async (req, res) => {
    try {
        const { name, icon, title, description, slug, metaTitle, metaDescription, keywords, subcategories } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        let settings = await getSafeSettings();
        if (!settings.categories) settings.categories = [];
        if (!settings.categories.some(c => c.name === name)) {
            settings.categories.push({
                name, icon, title, description, slug: slug || slugify(name),
                metaTitle, metaDescription, keywords, subcategories
            });
            settings.markModified('categories');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/categories/:category", async (req, res) => {
    try {
        const { category } = req.params;
        let settings = await getSafeSettings();
        if (settings && settings.categories) {
            // Find by name first
            let catIndex = settings.categories.findIndex(c => c.name === category);

            // If not found by name, try to find by slug
            if (catIndex === -1) {
                catIndex = settings.categories.findIndex(c => c.slug === category);
            }

            if (catIndex !== -1) {
                const deletedCat = settings.categories[catIndex];
                settings.categories.splice(catIndex, 1);
                settings.markModified('categories');
                await settings.save();

                // Also update products if needed
                if (deletedCat && deletedCat.name) {
                    await Product.updateMany({ category: deletedCat.name }, { category: 'Uncategorized' });
                }
            }
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Orders
app.post("/api/orders", async (req, res) => {
    try {
        const { userId, userValidation, items, totalAmount, paymentMethod } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ success: false, message: "Invalid order" });
        const validUserId = (userId === "admin" || !userId) ? null : userId;
        const newOrder = new Order({ userId: validUserId, userValidation, items, totalAmount, paymentMethod });
        await newOrder.save();

        // Email Notification
        try {
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'kmejri57@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'msncmujsbjqnszxp';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: senderEmail, pass: senderPass }
            });

            const itemsHtml = items.map(item => `<li><strong>${item.name}</strong><br>Quantité: ${item.quantity}<br>Prix: ${item.price}</li>`).join('');
            const mailOptions = {
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouvelle Commande - ${newOrder._id}`,
                html: `<h2>Nouvelle commande</h2><ul>${itemsHtml}</ul><h3>Total: ${totalAmount} DT</h3>`
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Order email error:", emailError);
        }

        res.status(201).json({ success: true, message: "Commande créée", order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur création commande" });
    }
});

app.get("/api/orders/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId === "admin" || !mongoose.Types.ObjectId.isValid(userId)) return res.status(200).json({ success: true, count: 0, data: [] });
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'username email');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.patch("/api/orders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: "Commande non trouvée" });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Commande non trouvée" });
        res.status(200).json({ success: true, message: "Commande supprimée" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/orders", async (req, res) => {
    try {
        await Order.deleteMany({});
        res.status(200).json({ success: true, message: "Toutes les commandes supprimées" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Support
app.get("/api/support/config", async (req, res) => {
    try {
        const settings = await GeneralSettings.findOne();
        res.json({ success: true, telegramUser: settings.support?.telegramUser || 'SatpromaxSupport', whatsappNumber: settings.support?.whatsappNumber || '21699999999' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
});

app.get("/api/support/types", async (req, res) => {
    res.json({ success: true, data: ['Payment Issue', 'Order Inquiry', 'Technical Support', 'Other'] });
});

app.post("/api/support/tickets", async (req, res) => {
    try {
        const ticket = new SupportTicket(req.body);
        await ticket.save();
        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/support/tickets", async (req, res) => {
    try {
        const tickets = await SupportTicket.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.put("/api/support/tickets/:id", async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.delete("/api/support/tickets/:id", async (req, res) => {
    try {
        await SupportTicket.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Reviews
app.post("/api/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        if (review.productId) {
            const reviews = await Review.find({ productId: review.productId, status: 'approved' });
            const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
            await Product.findByIdAndUpdate(review.productId, { rating: avgRating, reviewCount: reviews.length });
        }
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/api/reviews/approved", async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/reviews/product/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId, status: 'approved' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/reviews", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.patch("/api/reviews/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.delete("/api/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Search
app.get("/api/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false });
        const regex = new RegExp(q, 'i');
        const products = await Product.find({ $or: [{ name: regex }, { description: regex }, { category: regex }] });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get('/share/produit/:category/:slug', async (req, res) => {
    const { category, slug } = req.params;
    const shareUrl = `https://Satpromax.com/${category}/${slug}`;
    const product = await Product.findOne({ slug });
    const imageUrl = product ? product.image : 'https://Satpromax.com/logo.png';
    const title = product ? product.name : 'Produit Satpromax';

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="Découvrez ce produit sur Satpromax" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${shareUrl}" />
        <meta name="twitter:card" content="summary_large_image" />
        <script>window.location.href = "${shareUrl}";</script>
      </head>
      <body></body>
    </html>
    `);
});

// Guides
app.get("/api/guides", async (req, res) => {
    try {
        const guides = await Guide.find().sort({ order: 1 });
        res.status(200).json({ success: true, data: guides });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/guides/slug/:slug", async (req, res) => {
    try {
        const guide = await Guide.findOne({ slug: req.params.slug });
        if (!guide) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: guide });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post("/api/guide-inquiries", async (req, res) => {
    try {
        const inquiry = new GuideInquiry(req.body);
        await inquiry.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/guide-inquiries", async (req, res) => {
    try {
        const inquiries = await GuideInquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Contact
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, whatsapp, subject, message } = req.body;
        const newMessage = new ContactMessage({ name, email, whatsapp, subject, message });
        await newMessage.save();

        try {
            const settings = await GeneralSettings.findOne();
            const senderEmail = settings?.notificationSenderEmail || 'Satpromax2026@gmail.com';
            const senderPass = settings?.notificationSenderPassword || 'ywjatvegygdylvth';
            const receiverEmail = settings?.notificationReceiverEmail || 'mejrik1888@gmail.com';

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: senderEmail, pass: senderPass }
            });

            await transporter.sendMail({
                from: senderEmail,
                to: receiverEmail,
                subject: `Nouveau Message Contact - ${subject}`,
                text: `Nom: ${name}\nWhatsApp: ${whatsapp}\nMessage: ${message}`
            });
        } catch (emailError) {
            console.error("Contact Email Error:", emailError);
        }

        res.status(201).json({ success: true, message: "Message envoyé" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.get("/api/contact-messages", async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.delete("/api/contact-messages/:id", async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// --- STATIC FILES (MIDDLEWARE) ---
// Must come after API routes but before catch-all
app.use(express.static(CLIENT_DIST, { index: false }));

// --- SEO INJECTION HELPERS ---
const injectSEO = (html, data) => {
    if (!data) return html;
    let injected = html;

    const replacements = {
        title: [/<title>.*?<\/title>/i, `<title>${data.title}</title>`],
        description: [/<meta\s+[^>]*name=["']description["'][^>]*>/i, `<meta name="description" content="${data.description}" />`],
        ogTitle: [/<meta\s+[^>]*property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${data.title}" />`],
        ogDescription: [/<meta\s+[^>]*property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${data.description}" />`],
        ogImage: [/<meta\s+[^>]*property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${data.image}" />`],
        ogUrl: [/<meta\s+[^>]*property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${data.url}" />`],
        twitterTitle: [/<meta\s+[^>]*property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${data.title}" />`],
        twitterDescription: [/<meta\s+[^>]*property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${data.description}" />`],
        twitterImage: [/<meta\s+[^>]*property=["']twitter:image["'][^>]*>/i, `<meta property="twitter:image" content="${data.image}" />`],
        canonical: [/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${data.url}" />`]
    };

    for (const [key, [regex, replacement]] of Object.entries(replacements)) {
        if (injected.match(regex)) {
            // Using function for replace to avoid special character issues ($)
            injected = injected.replace(regex, () => replacement);
        } else if (key !== 'canonical' || data.url) {
            injected = injected.replace('</head>', () => `${replacement}</head>`);
        }
    }

    if (data.schema) {
        const schemaScript = `<script type="application/ld+json">${JSON.stringify(data.schema)}</script>`;
        injected = injected.replace('</head>', () => `${schemaScript}</head>`);
    }

    return injected;
};

const generateServerProductSchema = (product, url) => {
    if (!product) return null;
    const isPromo = product.promoPrice && product.promoEndDate && new Date(product.promoEndDate) > new Date();
    const priceStr = isPromo ? product.promoPrice : product.price;
    const numericPrice = parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;

    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": Array.isArray(product.gallery) && product.gallery.length > 0 ? [product.image, ...product.gallery] : [product.image],
        "description": product.description || `Acheter ${product.name} chez Satpromax.`,
        "sku": product.sku || product._id,
        "mpn": product.sku || product._id,
        "brand": { "@type": "Brand", "name": "Satpromax" },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": "TND",
            "price": numericPrice,
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "Satpromax" }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "1"
        }
    };
};

const generateServerBreadcrumbSchema = (crumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": c.name,
        "item": c.url
    }))
});

// --- FINAL CATCH-ALL ROUTE (SEO + SSR MIDDLEWARE) ---
// --- FINAL CATCH-ALL ROUTE (SEO + SSR MIDDLEWARE) ---
app.get(/.*/, async (req, res, next) => {
    // 1. Explicitly Ignore /api/ routes (Safety check)
    if (req.path.startsWith('/api/')) return next();

    // 3. Load Index HTML
    let htmlContent;
    try {
        htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');
    } catch (err) {
        console.error("Client build Missing:", err);
        return res.status(500).send("Server Error: Client build not found.");
    }

    try {
        const fullUrl = `https://Satpromax.com${req.path}`;
        const parts = req.path.split('/').filter(Boolean);

        // A. HOME PAGE
        if (parts.length === 0) {
            const homeSchema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Satpromax",
                "url": "https://Satpromax.com",
                "logo": "https://Satpromax.com/logo.png"
            };

            htmlContent = injectSEO(htmlContent, {
                title: "Satpromax- Meilleur Abonnement IPTV & Streaming Tunisie",
                description: "Satpromax: Votre destination n°1 pour les abonnements IPTV, Netflix, Shahid VIP et produits High-Tech en Tunisie.",
                image: "https://Satpromax.com/og-image.jpg",
                url: fullUrl,
                schema: homeSchema
            });
        }

        // B. PRODUCT DETAILS or CATEGORY
        else if (parts.length >= 1) {
            const potentialSlug = parts[parts.length - 1]; // Assume last part is slug
            const product = await Product.findOne({ slug: potentialSlug });

            if (product) {
                const productSchema = generateServerProductSchema(product, fullUrl);
                const breadcrumbSchema = generateServerBreadcrumbSchema([
                    { name: 'Home', url: 'https://Satpromax.com/' },
                    { name: product.category, url: `https://Satpromax.com/${slugify(product.category)}` },
                    { name: product.name, url: fullUrl }
                ]);

                const cleanDescription = (product.description || "Découvrez ce produit sur Satpromax.")
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/"/g, '&quot;')
                    .trim()
                    .substring(0, 160);

                htmlContent = injectSEO(htmlContent, {
                    title: `${product.name} | Satpromax`,
                    description: cleanDescription,
                    image: product.image,
                    url: fullUrl,
                    schema: [productSchema, breadcrumbSchema]
                });
            } else {
                if (parts.length === 1) {
                    const categorySlug = parts[0];
                    const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ');
                    htmlContent = injectSEO(htmlContent, {
                        title: `${categoryName} - Produits et Abonnements | Satpromax`,
                        description: `Découvrez notre collection ${categoryName} : meilleurs prix et service garanti.`,
                        image: "https://Satpromax.com/logo.png",
                        url: fullUrl
                    });
                } else {
                    htmlContent = injectSEO(htmlContent, {
                        title: "Satpromax- Tunisie",
                        description: "Votre boutique en ligne préférée.",
                        url: fullUrl
                    });
                }
            }
        }

    } catch (err) {
        console.error("SEO Injection failed:", err);
    }

    res.send(htmlContent);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
