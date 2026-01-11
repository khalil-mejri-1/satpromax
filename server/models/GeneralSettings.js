const mongoose = require('mongoose');

const GeneralSettingsSchema = new mongoose.Schema({
    paymentModes: [mongoose.Schema.Types.Mixed],
    deviceChoices: [{
        type: String,
        trim: true
    }],
    categories: [mongoose.Schema.Types.Mixed],
    whatsappNumber: { type: String, trim: true, default: "21697496300" },
    topStripText: { type: String, trim: true, default: "WhatsApp : +216 97 490 300" },
    topStripMessage: { type: String, trim: true, default: "Bienvenue sur satpromax !" },
    heroMainImages: [String],
    heroCardBoxImages: [String],
    heroCardNetflixImage: String,
    heroCardGiftImage: String,
    heroCardSoftImage: String,
    footerDescription: { type: String, trim: true, default: "satpromax est en train de devenir un leader mondial dans le domaine du divertissement numérique..." },
    footerContactPhone: { type: String, trim: true, default: "TN +216 97 490 300" },
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
    resetCode: String,
    resetCodeExpires: Date
}, { timestamps: true });

// Ensure only one document exists usually
module.exports = mongoose.model('GeneralSettings', GeneralSettingsSchema);
