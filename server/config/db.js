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
            family: 4, // Force IPv4 (Fixes Windows localhost DNS issues)
            maxPoolSize: 100, 
            minPoolSize: 5,  // Reduced slightly to not overload free tier on startup
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect("mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus?appName=Cluster0", options);
        isConnected = true;
        console.log("🚀 [MongoDB] Initial Connection Successful (Pool Optimized)");
    } catch (error) {
        console.error("🔴 [MongoDB] Initial Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
