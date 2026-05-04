const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("♻️ [MongoDB] Already connected, reusing existing pool.");
        return;
    }

    mongoose.connection.on('connected', () => console.log('🟢 [MongoDB] Connection Established'));
    mongoose.connection.on('error', (err) => console.error('🔴 [MongoDB] Connection Error:', err));
    mongoose.connection.on('disconnected', () => console.warn('🟡 [MongoDB] Disconnected! Connection dropped by VPS/Atlas.'));
    mongoose.connection.on('reconnected', () => console.log('🔵 [MongoDB] Reconnected successfully.'));

    try {
        const options = {
            serverSelectionTimeoutMS: 30000, // Relaxed to 30s to survive network hiccups
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            heartbeatFrequencyMS: 2000, // Check connection health every 2 seconds
            maxIdleTimeMS: 10000, // IMPORTANT: Prevent stale socket starvation (fixes 40s delay)
            family: 4, // Force IPv4 (Fixes Windows localhost DNS issues)
            maxPoolSize: 100,
            minPoolSize: 5,  // Reduced slightly to not overload free tier on startup
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/technoplus", options);
        isConnected = true;
        console.log("🚀 [MongoDB] Initial Connection Successful (Pool Optimized)");
    } catch (error) {
        console.error("🔴 [MongoDB] Initial Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
