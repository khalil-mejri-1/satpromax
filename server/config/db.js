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
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000, 
            family: 4, 
            maxPoolSize: 50, 
            minPoolSize: 5 // As requested
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
