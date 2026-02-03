const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    userValidation: {
        name: String,
        address: String,
        whatsapp: String
    },
    items: [{
        productId: String,
        name: String,
        quantity: Number,
        price: String,
        image: String,
        deviceChoice: String,
        receiverSerial: String,
        macAddress: String,
        deviceKey: String,
        subscriptionFormat: String
    }],
    totalAmount: Number,
    status: {
        type: String,
        default: 'En attente',
        enum: ['En attente', 'Confirmé', 'Expédié', 'Livré', 'Annulé']
    },
    paymentMethod: {
        type: String,
        default: 'cod'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
