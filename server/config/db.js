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
        const remoteURI = "mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus";
        await mongoose.connect(remoteURI, options);
        isConnected = true;
        console.log("🚀 [MongoDB Atlas] Connection Successful (Remote Only) ✅");
    } catch (error) {
        console.error("🔴 [MongoDB] Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
