const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

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

// --- SETTINGS UTILS ---
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
        console.error("Error in getSafeSettings:", err);
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
app.use("/api", (req, res, next) => {
    console.log(`[API LOG] ${req.method} ${req.originalUrl}`);
    if (req.method === 'POST') {
        console.log(`[POST DEBUG] Body Keys: ${Object.keys(req.body || {})}`);
    }
    next();
});

app.post("/api/support/fields", async (req, res) => {
    console.log(">>> [TOP PRIORITY] POST /api/support/fields called!");
    console.log(">>> Body:", JSON.stringify(req.body, null, 2));
    try {
        const { fields } = req.body;
        if (!Array.isArray(fields)) {
            console.log(">>> Error: fields is not an array");
            return res.status(400).json({ success: false, message: "Fields must be an array" });
        }
        const settings = await getSafeSettings();
        settings.supportFormFields = fields;
        await settings.save();
        console.log(">>> Fields saved successfully");
        res.json({ success: true, data: settings.supportFormFields });
    } catch (error) {
        console.error(">>> CRITICAL Error in POST /api/support/fields:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/api-status", (req, res) => {
    res.json({
        status: "ok ok ok",
        version: "1.0.1",
        time: new Date().toISOString()
    });
});

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

// --- SUPPORT ROUTES ---
app.get("/api/support/config", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        res.json({
            success: true,
            telegramUser: settings.support?.telegramUser || 'SatpromaxSupport',
            whatsappNumber: settings.support?.whatsappNumber || '21699999999',
            heroImage: settings.supportHeroImage || '',
            fields: settings.supportFormFields || [],
            types: settings.supportIssueTypes ? settings.supportIssueTypes.map(t => t.name) : []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
});

app.put("/api/support/config", async (req, res) => {
    try {
        const { heroImage } = req.body;
        const settings = await getSafeSettings();
        if (heroImage !== undefined) settings.supportHeroImage = heroImage;
        await settings.save();
        res.json({ success: true, heroImage: settings.supportHeroImage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
});

app.get("/api/support/types", async (req, res) => {
    try {
        const settings = await getSafeSettings();
        const types = settings.supportIssueTypes && settings.supportIssueTypes.length > 0
            ? settings.supportIssueTypes.map(t => t.name)
            : ['Payment Issue', 'Order Inquiry', 'Technical Support', 'Other'];

        if (!settings.supportIssueTypes || settings.supportIssueTypes.length === 0) {
            settings.supportIssueTypes = types.map(name => ({ name }));
            await settings.save();
        }

        res.json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post("/api/support/types", async (req, res) => {
    console.log("POST /api/support/types called", req.body);
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Name required" });
        const settings = await getSafeSettings();
        if (!settings.supportIssueTypes) settings.supportIssueTypes = [];
        if (!settings.supportIssueTypes.some(t => t.name === name)) {
            settings.supportIssueTypes.push({ name });
            await settings.save();
        }
        res.json({ success: true, data: settings.supportIssueTypes.map(t => t.name) });
    } catch (error) {
        console.error("Error in POST /api/support/types:", error);
        res.status(500).json({ success: false });
    }
});

app.delete("/api/support/types/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.supportIssueTypes) {
            settings.supportIssueTypes = settings.supportIssueTypes.filter(t => t.name !== name);
            await settings.save();
        }
        res.json({ success: true, data: settings.supportIssueTypes.map(t => t.name) });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Products

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
        const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
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
        console.log("PUT /api/products/:id received:", JSON.stringify(productData, null, 2));
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

app.put("/api/products/:id/seo", async (req, res) => {
    try {
        const { h1, subheadings } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { seoH1: h1, seoSubheadings: subheadings },
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.status(200).json({ success: true, data: product });
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
            if (settings.twoFactorEnabled) {
                return res.status(200).json({
                    success: true,
                    require2FA: true,
                    userId: 'admin',
                    message: "2FA Required"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Connexion réussie (Admin)",
                user: { id: "admin", username: "Administrator", email: adminEmail, role: 'admin', twoFactorEnabled: false }
            });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        if (user.password !== password) return res.status(400).json({ success: false, message: "Mot de passe incorrect" });

        console.log(`[LOGIN] User ${user.email} (ID: ${user._id}) - 2FA Enabled in DB: ${user.twoFactorEnabled}`);

        if (user.twoFactorEnabled) {
            return res.status(200).json({
                success: true,
                require2FA: true,
                userId: user._id,
                message: "2FA Required"
            });
        }

        res.status(200).json({
            success: true,
            message: "Connexion réussie",
            user: { id: user._id, username: user.username, email: user.email, role: user.role, twoFactorEnabled: user.twoFactorEnabled }
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

// --- 2FA Endpoints ---
app.post("/api/auth/2fa/generate", async (req, res) => {
    try {
        const { userId } = req.body;
        let user;
        let isGeneralAdmin = false;

        if (userId === 'admin') {
            user = await getSafeSettings();
            isGeneralAdmin = true;
        } else {
            user = await User.findById(userId);
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const secret = speakeasy.generateSecret({ name: `TechnoPlus (${isGeneralAdmin ? 'Admin' : user.email})` });

        user.twoFactorSecret = secret.base32;
        await user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ success: false, message: "Error generating QR Code" });
            res.json({ success: true, secret: secret.base32, qrCode: data_url });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/auth/2fa/verify", async (req, res) => {
    try {
        const { userId, token } = req.body;
        let user;
        if (userId === 'admin') {
            user = await getSafeSettings();
        } else {
            user = await User.findById(userId);
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            user.markModified('twoFactorEnabled');
            const savedUser = await user.save();
            console.log(`[2FA] Enabled for user ${userId} (${user.email || 'admin'}). DB Value: ${savedUser.twoFactorEnabled}`);
            res.json({ success: true, message: "2FA Enabled successfully" });
        } else {
            console.log(`[2FA] Verification failed for user ${userId}`);
            res.status(400).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
        console.error("[2FA] Verify Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/auth/2fa/disable", async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`[2FA] Disable request for ${userId}`);
        let user;
        if (userId === 'admin') {
            user = await getSafeSettings();
        } else {
            user = await User.findById(userId);
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();
        console.log(`[2FA] Disabled for user ${userId}`);
        res.json({ success: true, message: "2FA Disabled" });
    } catch (error) {
        console.error("[2FA] Disable Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/auth/2fa/login", async (req, res) => {
    try {
        const { userId, token } = req.body;
        console.log(`[2FA] Login attempt for ${userId}`);
        let user;
        let isGeneralAdmin = false;
        if (userId === 'admin') {
            user = await getSafeSettings();
            isGeneralAdmin = true;
        } else {
            user = await User.findById(userId);
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.twoFactorSecret) {
            // Should not happen if flow is correct, but fail safe
            return res.status(400).json({ success: false, message: "2FA not set up for this user" });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            const userData = isGeneralAdmin ?
                { id: "admin", username: "Administrator", email: user.adminEmail, role: 'admin', twoFactorEnabled: true } :
                { id: user._id, username: user.username, email: user.email, role: user.role, twoFactorEnabled: true };

            res.json({ success: true, message: "Login successful", user: userData });
        } else {
            res.status(400).json({ success: false, message: "Invalid 2FA Code" });
        }
    } catch (error) {
        console.error("2FA Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
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
// getSafeSettings moved to top for safety

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

app.put("/api/settings/categories/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const { newCategory, newIcon, newTitle, newDescription, newSlug, newMetaTitle, newMetaDescription, newKeywords, subcategories } = req.body;
        let settings = await getSafeSettings();
        if (settings && settings.categories) {
            // Find by name (case-insensitive) or by slug
            let catIndex = settings.categories.findIndex(c => c.name.toLowerCase() === category.toLowerCase());
            if (catIndex === -1) {
                catIndex = settings.categories.findIndex(c => c.slug === category);
            }

            if (catIndex !== -1) {
                const oldName = settings.categories[catIndex].name;
                settings.categories[catIndex] = {
                    ...settings.categories[catIndex],
                    name: newCategory || settings.categories[catIndex].name,
                    icon: newIcon !== undefined ? newIcon : settings.categories[catIndex].icon,
                    title: newTitle !== undefined ? newTitle : settings.categories[catIndex].title,
                    description: newDescription !== undefined ? newDescription : settings.categories[catIndex].description,
                    slug: newSlug || settings.categories[catIndex].slug,
                    metaTitle: newMetaTitle !== undefined ? newMetaTitle : settings.categories[catIndex].metaTitle,
                    metaDescription: newMetaDescription !== undefined ? newMetaDescription : settings.categories[catIndex].metaDescription,
                    keywords: newKeywords !== undefined ? newKeywords : settings.categories[catIndex].keywords,
                    subcategories: subcategories !== undefined ? subcategories : settings.categories[catIndex].subcategories
                };
                settings.markModified('categories');
                await settings.save();

                // If name changed, update all products in this category
                if (newCategory && newCategory !== oldName) {
                    await Product.updateMany({ category: oldName }, { category: newCategory });
                }
            }
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Error updating category:", error);
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

// Payment Modes
app.post("/api/settings/payment-modes", async (req, res) => {
    try {
        const { name, logo } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        const settings = await getSafeSettings();
        if (!settings.paymentModes) settings.paymentModes = [];
        if (!settings.paymentModes.find(m => m.name === name)) {
            settings.paymentModes.push({ name, logo });
            settings.markModified('paymentModes');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/payment-modes/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.paymentModes) {
            settings.paymentModes = settings.paymentModes.filter(m => m.name !== name);
            settings.markModified('paymentModes');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Device Choices
app.post("/api/settings/device-choices", async (req, res) => {
    try {
        const { choice } = req.body;
        if (!choice) return res.status(400).json({ success: false, message: "Choix requis" });
        const settings = await getSafeSettings();
        if (!settings.deviceChoices) settings.deviceChoices = [];
        if (!settings.deviceChoices.includes(choice)) {
            settings.deviceChoices.push(choice);
            settings.markModified('deviceChoices');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/device-choices/:choice", async (req, res) => {
    try {
        const { choice } = req.params;
        const settings = await getSafeSettings();
        if (settings.deviceChoices) {
            settings.deviceChoices = settings.deviceChoices.filter(c => c !== choice);
            settings.markModified('deviceChoices');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Resolutions
app.post("/api/settings/resolutions", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        const settings = await getSafeSettings();
        if (!settings.resolutions) settings.resolutions = [];
        if (!settings.resolutions.find(r => r.name === name)) {
            settings.resolutions.push({ name, image });
            settings.markModified('resolutions');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/resolutions/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.resolutions) {
            settings.resolutions = settings.resolutions.filter(r => r.name !== name);
            settings.markModified('resolutions');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Regions
app.post("/api/settings/regions", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        const settings = await getSafeSettings();
        if (!settings.regions) settings.regions = [];
        if (!settings.regions.find(r => r.name === name)) {
            settings.regions.push({ name, image });
            settings.markModified('regions');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/regions/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.regions) {
            settings.regions = settings.regions.filter(r => r.name !== name);
            settings.markModified('regions');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Bouquets
app.post("/api/settings/bouquets", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        const settings = await getSafeSettings();
        if (!settings.bouquets) settings.bouquets = [];
        if (!settings.bouquets.find(b => b.name === name)) {
            settings.bouquets.push({ name, image });
            settings.markModified('bouquets');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/bouquets/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.bouquets) {
            settings.bouquets = settings.bouquets.filter(b => b.name !== name);
            settings.markModified('bouquets');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Subscription Formats
app.post("/api/settings/subscription-formats", async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Nom requis" });
        const settings = await getSafeSettings();
        if (!settings.subscriptionFormats) settings.subscriptionFormats = [];
        if (!settings.subscriptionFormats.find(s => s.name === name)) {
            settings.subscriptionFormats.push({ name, image });
            settings.markModified('subscriptionFormats');
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

app.delete("/api/settings/subscription-formats/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const settings = await getSafeSettings();
        if (settings.subscriptionFormats) {
            settings.subscriptionFormats = settings.subscriptionFormats.filter(s => s.name !== name);
            settings.markModified('subscriptionFormats');
            await settings.save();
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

// Reviews
app.post("/api/reviews", async (req, res) => {
    try {
        console.log("POST /api/reviews body:", req.body);
        const { username, comment, rating, productId } = req.body;

        if (!username || !rating) {
            return res.status(400).json({ success: false, message: "Nom et note sont requis." });
        }

        const reviewData = { username, comment, rating, status: 'pending' };
        if (productId && productId !== "" && productId !== "null" && mongoose.Types.ObjectId.isValid(productId)) {
            reviewData.productId = productId;
        }

        const review = new Review(reviewData);
        await review.save();

        if (review.productId) {
            const reviews = await Review.find({ productId: review.productId, status: 'approved' });
            const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
            await Product.findByIdAndUpdate(review.productId, { rating: avgRating, reviewCount: reviews.length });
        }
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement de l'avis: " + error.message });
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

const generateServerHeader = (categories) => {
    const navLinks = categories.map(c =>
        `<li><a href="/${c.slug || slugify(c.name)}">${c.name}</a></li>`
    ).join('');

    return `
    <header class="ssr-header" style="padding: 15px; border-bottom: 1px solid #eee;">
        <div class="logo" style="margin-bottom: 10px;"><a href="/" style="font-weight: bold; font-size: 20px; text-decoration: none; color: #333;">Satpromax</a></div>
        <nav>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 15px; flex-wrap: wrap;">
                <li><a href="/" style="text-decoration: none; color: #555;">Accueil</a></li>
                ${navLinks}
                <li><a href="/contact" style="text-decoration: none; color: #555;">Contact</a></li>
                <li><a href="/support" style="text-decoration: none; color: #555;">Support</a></li>
            </ul>
        </nav>
    </header>
    `;
};

const generateServerFooter = () => `
    <footer class="ssr-footer" style="margin-top: 50px; padding: 30px; background: #f8fafc; text-align: center;">
        <div class="footer-links" style="margin-bottom: 20px; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="/about" style="color: #64748b;">À propos</a>
            <a href="/guide-installation" style="color: #64748b;">Guides</a>
            <a href="/contact" style="color: #64748b;">Contact</a>
            <a href="/terms" style="color: #64748b;">CGV</a>
            <a href="/privacy" style="color: #64748b;">Confidentialité</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} Satpromax. Tous droits réservés.</p>
    </footer>
`;

const generateServerProductHTML = (product, similarProducts = [], categories = []) => {
    if (!product) return "";
    const isPromo = product.promoPrice && product.promoEndDate && new Date(product.promoEndDate) > new Date();

    let extraContent = "";
    if (product.extraSections && product.extraSections.length > 0) {
        extraContent = product.extraSections.map(s => `
            <div style="margin-top: 20px;">
                <h3>${s.title}</h3>
                <div>${s.content || ''}</div>
            </div>
        `).join('');
    }

    const similarLinks = similarProducts.map(p => `
        <a href="/${slugify(p.category)}/${p.slug}" class="ssr-similar-link" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #333; margin-bottom: 10px;">
            <img src="${p.image}" alt="${p.name}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />
            <span style="font-size: 14px; font-weight: 500;">${p.name}</span>
        </a>
    `).join('');

    return `
        <div class="ssr-shell">
            ${generateServerHeader(categories)}
            <div class="ssr-content product-page" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <div class="breadcrumb" style="margin-bottom: 20px; color: #64748b; font-size: 14px;">
                    <a href="/" style="color: inherit;">Accueil</a> / 
                    <a href="/${slugify(product.category)}" style="color: inherit;">${product.category}</a> / 
                    <span>${product.name}</span>
                </div>

                <main style="display: grid; grid-template-columns: 300px 1fr; gap: 40px;">
                    <div class="image-col">
                         <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 12px;" />
                    </div>
                    <div class="info-col">
                        <h1 style="margin-top: 0;">${product.name}</h1>
                        <div class="price" style="font-size: 24px; color: #ef4444; margin: 15px 0;">
                            ${isPromo ? `<del style="color: #94a3b8; font-size: 18px;">${product.price}</del> <strong>${product.promoPrice} DT</strong>` : `<strong>${product.price} DT</strong>`}
                        </div>
                        <div class="description">
                            <h3>${product.description || ''}</h3>
                            <h3 style="line-height: 1.6;">${product.descriptionGlobal || ''}</h3>
                        </div>
                        <div class="extra-sections">
                            ${extraContent}
                        </div>
                        <div class="meta" style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; color: #64748b;">
                            <h3>SKU: ${product.sku || 'N/A'}</h3>
                            <h3>Disponibilité: ${product.inStock !== false ? 'En Stock' : 'Épuisé'}</h3>
                        </div>
                    </div>
                </main>

                <aside class="similar-products" style="margin-top: 60px;">
                    <h3 style="border-bottom: 2px solid #fbbf24; padding-bottom: 10px; display: inline-block;">Vous aimerez aussi</h3>
                    <div class="links-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                        ${similarLinks}
                    </div>
                </aside>
            </div>
            ${generateServerFooter()}
        </div>
    `;
};

const generateServerHomeHTML = (products, categories) => {
    return `
        <div class="ssr-shell">
            ${generateServerHeader(categories)}
            <div class="ssr-content home-page" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <h1>Satpromax - Meilleur Abonnement IPTV & Streaming Tunisie</h1>
                <h5>Découvrez les meilleurs abonnements Streaming, IPTV et Gaming chez Satpromax.</h5>
                
                <section class="categories" style="margin-top: 40px;">
                    <h2>Nos Catégories</h2>
                    <ul style="display: flex; gap: 20px; list-style: none; padding: 0; flex-wrap: wrap;">
                        ${categories.map(c => `<li style="background: #f1f5f9; padding: 10px 20px; border-radius: 8px;"><a href="/${c.slug || slugify(c.name)}" style="text-decoration: none; color: #1e293b; font-weight: bold;">${c.name}</a></li>`).join('')}
                    </ul>
                </section>

                <section class="products" style="margin-top: 50px;">
                    <h2>Derniers Produits</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                        ${products.map(p => `
                            <div class="product-card" style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; text-align: center;">
                                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 150px; object-fit: contain;" />
                                <h3 style="font-size: 16px; margin: 10px 0;">${p.name}</h3>
                                <h3 style="color: #ef4444; font-weight: bold;">${p.price} DT</h3>
                                <a href="/${slugify(p.category)}/${p.slug}" style="display: inline-block; padding: 8px 16px; background: #fbbf24; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Voir Détails</a>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
            ${generateServerFooter()}
        </div>
    `;
};

// --- FINAL CATCH-ALL ROUTE (SEO + SSR MIDDLEWARE) ---
app.get(/.*/, async (req, res, next) => {
    // 1. Explicitly ignore ALL API calls to let them reach their routes
    if (req.path.startsWith('/api')) {
        return next();
    }

    // 2. Load Index HTML
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
        const settings = await GeneralSettings.findOne(); // Fetch settings once for global Navbar
        const categories = settings?.categories || [];

        // A. HOME PAGE
        if (parts.length === 0) {
            const homeSchema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Satpromax",
                "url": "https://Satpromax.com",
                "logo": "https://Satpromax.com/logo.png"
            };

            const homeProducts = await Product.find().sort({ createdAt: -1 }).limit(20);

            const bodyContent = generateServerHomeHTML(homeProducts, categories);
            htmlContent = htmlContent.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

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
                // Fetch Similar Products for Internal Linking
                const similarProducts = await Product.find({
                    category: product.category,
                    _id: { $ne: product._id }
                }).limit(8).select('name slug category image price');

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

                const bodyContent = generateServerProductHTML(product, similarProducts, categories);
                htmlContent = htmlContent.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

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
                    const category = settings?.categories?.find(c => c.slug === categorySlug);
                    const categoryName = category ? category.name : (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '));

                    // Fetch category products for SSR injection
                    const categoryProducts = await Product.find({
                        category: { $regex: new RegExp(`^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                    }).limit(24);

                    const bodyContent = `
                        <div class="ssr-shell">
                            ${generateServerHeader(categories)}
                            <div class="ssr-content category-page">
                                <h1>Boutique ${categoryName} - Satpromax</h1>
                                <h4>Découvrez notre sélection de produits dans la catégorie ${categoryName}.</h4>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
                                    ${categoryProducts.map(p => `
                                        <div class="product-card" style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; text-align: center;">
                                            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 150px; object-fit: contain;" />
                                            <h3 style="font-size: 16px; margin: 10px 0;">${p.name}</h3>
                                            <h3 style="color: #ef4444; font-weight: bold;">${p.price} DT</h3>
                                            <a href="/${categorySlug}/${p.slug}" style="display: inline-block; padding: 8px 16px; background: #fbbf24; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Voir</a>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            ${generateServerFooter()}
                        </div>
                    `;
                    htmlContent = htmlContent.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

                    htmlContent = injectSEO(htmlContent, {
                        title: `${categoryName} - Produits et Abonnements | Satpromax`,
                        description: `Découvrez notre collection ${categoryName} : meilleurs prix et service garanti en Tunisie.`,
                        image: "https://Satpromax.com/logo.png",
                        url: fullUrl
                    });
                } else {
                    htmlContent = injectSEO(htmlContent, {
                        title: "Satpromax- Tunisie",
                        description: "Votre boutique en ligne préférée pour les abonnements digitaux.",
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
