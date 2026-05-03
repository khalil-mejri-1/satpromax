const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus?appName=Cluster0";

const optimizeDB = async () => {
    try {
        console.log("Connecting to MongoDB for optimization...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected ✅");

        const db = mongoose.connection.db;
        const collection = db.collection('products');

        console.log("Creating indexes for lightning-fast performance...");

        // 1. Index for Category filtering + Creation Date sorting (Home Page Sliders)
        console.log("- Creating Compound Index: category + createdAt");
        await collection.createIndex({ category: 1, createdAt: -1 });

        // 2. Index for Slug lookup (Product Details Page)
        console.log("- Creating Index: slug");
        await collection.createIndex({ slug: 1 }, { unique: true });

        // 3. Index for Newest sorting
        console.log("- Creating Index: createdAt");
        await collection.createIndex({ createdAt: -1 });

        // 4. Index for Price sorting/filtering
        console.log("- Creating Index: price");
        await collection.createIndex({ price: 1 });

        console.log("All indexes created successfully! 🚀");
        console.log("Your queries will now be significantly faster.");

        process.exit(0);
    } catch (error) {
        console.error("Optimization failed ❌", error);
        process.exit(1);
    }
};

optimizeDB();
