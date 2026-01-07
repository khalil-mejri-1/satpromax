const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus?appName=Cluster0");
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("DB connection error ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
