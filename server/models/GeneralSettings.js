const mongoose = require('mongoose');

const GeneralSettingsSchema = new mongoose.Schema({
    paymentModes: [mongoose.Schema.Types.Mixed],
    deviceChoices: [{
        type: String,
        trim: true
    }],
    categories: [{
        name: { type: String, trim: true },
        slug: { type: String, trim: true },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true },
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },
        keywords: { type: String, trim: true },
        subcategories: [String],
        subCategories: [{
            name: { type: String, trim: true },
            seoH1: String,
            seoSubheadings: [{ level: String, text: String }]
        }],
        seoH1: String,
        seoSubheadings: [{ level: String, text: String }]
    }],
    whatsappNumber: { type: String, trim: true, default: "21697496300" },
    topStripText: { type: String, trim: true, default: "WhatsApp : +216 97 490 300" },
    topStripMessage: { type: String, trim: true, default: "Bienvenue sur Satpromax !" },
    heroMainImages: [String],
    heroCardBoxImages: [String],
    heroCardBoxImage: String,
    heroCardBoxTitle: { type: String, default: "Box Android\nEt Recepteur" },
    heroCardBoxLink: { type: String, default: "/category/box-android" },
    heroCardNetflixImage: String,
    heroCardNetflixTitle: { type: String, default: "Netflix\nTunisie" },
    heroCardNetflixLink: { type: String, default: "/category/streaming" },
    heroCardGiftImage: String,
    heroCardGiftTitle: { type: String, default: "Cartes Cadeaux\nDigitales" },
    heroCardGiftLink: { type: String, default: "/category/gift-card" },
    heroCardSoftImage: String,
    heroCardSoftTitle: { type: String, default: "Logiciels" },
    heroCardSoftLink: { type: String, default: "/category/software" },
    guideHeroImage: { type: String, default: "https://www.mysat.tn/wp-content/uploads/2023/11/Popcorn-in-striped-tub-scaled.jpg" },
    guidePageBgImage: { type: String, default: "" },
    promoCards: [{
        title: { type: String, trim: true },
        image: { type: String, trim: true },
        link: { type: String, trim: true } // Should map to category slug usually
    }],
    footerDescription: { type: String, trim: true, default: "Satpromax est en train de devenir un leader mondial dans le domaine du divertissement numérique..." },
    footerContactPhone: { type: String, trim: true, default: "TN +216 97 490 300" },
    socialLinks: [{
        name: String,
        icon: String,
        url: String
    }],
    facebookUrl: { type: String, trim: true, default: "https://www.facebook.com" },
    telegramUrl: { type: String, trim: true, default: "https://t.me/" },
    footerColumn1: {
        title: { type: String, default: 'IPTV Premium' },
        links: [String]
    },
    footerColumn2: {
        title: { type: String, default: 'Streaming' },
        links: [String]
    },
    footerColumn3: {
        title: { type: String, default: 'Cartes Cadeaux' },
        links: [String]
    },
    productTitleColor: { type: String, default: '#ffffff' },
    adminEmail: { type: String, default: 'ferid123@admin.test' },
    adminPassword: { type: String, default: '123456' },
    senderEmail: { type: String, default: 'kmejri57@gmail.com' },
    senderPassword: { type: String, default: 'msncmujsbjqnszxp' },
    notificationSenderEmail: { type: String, default: 'kmejri57@gmail.com' },
    notificationSenderPassword: { type: String, default: 'msncmujsbjqnszxp' },
    notificationReceiverEmail: { type: String, default: 'mejrik1888@gmail.com' },
    resetCode: String,
    resetCodeExpires: Date,
    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    resolutions: [{
        name: { type: String, trim: true },
        image: { type: String, trim: true }
    }],
    regions: [{
        name: { type: String, trim: true },
        image: { type: String, trim: true }
    }],
    supportIssueTypes: [{
        name: { type: String, trim: true }
    }],
    bouquets: [{
        name: { type: String, trim: true },
        image: { type: String, trim: true }
    }],
    subscriptionFormats: [{
        name: { type: String, trim: true },
        image: { type: String, trim: true }
    }],
    supportFormFields: [{
        label: { type: String, required: true },
        type: { type: String, enum: ['text', 'number'], default: 'text' },
        placeholder: { type: String }
    }],
    reviewsPageSeo: { h1: String, subheadings: [{ level: String, text: String }] },
    guidesPageSeo: { h1: String, subheadings: [{ level: String, text: String }] },
    questionsPageSeo: { h1: String, subheadings: [{ level: String, text: String }] },
    contactPageSeo: { h1: String, subheadings: [{ level: String, text: String }] },
    supportPageSeo: { h1: String, subheadings: [{ level: String, text: String }] },
    supportHeroImage: { type: String, default: "/images/support-hero-bg.png" },
    homeMetaTitle: String,
    homeMetaDescription: String,
    homeSeoH1: String,
    homeSeoSubheadings: [{ level: String, text: String }],
    buttonColor: { type: String, default: '#fbbf24' },
    buttonTextColor: { type: String, default: '#000000' },
    customButtons: [{
        id: String,
        name: String,
        selector: String,
        backgroundColor: String,
        color: String,
        isGradient: { type: Boolean, default: false },
        gradientColor1: String,
        gradientColor2: String,
        gradientAngle: { type: Number, default: 45 }
    }],
    siteLogo: { type: String, default: "https://i.ibb.co/kRsrFC3/Untitled-design-6-pixian-ai.png" }
}, { timestamps: true });

// Ensure only one document exists usually
module.exports = mongoose.model('GeneralSettings', GeneralSettingsSchema);
