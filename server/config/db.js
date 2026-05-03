const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };
        await mongoose.connect("mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus?appName=Cluster0", options);
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("DB connection error ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
