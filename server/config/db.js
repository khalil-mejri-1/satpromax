const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("♻️ [MongoDB] Already connected, reusing existing pool.");
        return;
    }

    const options = {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 2000,
        maxIdleTimeMS: 10000,
        family: 4,
        maxPoolSize: 100,
        minPoolSize: 5,
        retryWrites: true,
        w: 'majority'
    };

    try {
        // Connect to Primary Local DB
        await mongoose.connect("mongodb://127.0.0.1:27017/technoplus", options);
        console.log("🟢 [Local DB] Connected Successfully ✅");

        isConnected = true;
    } catch (error) {
        console.error("🔴 [MongoDB] Initial Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
