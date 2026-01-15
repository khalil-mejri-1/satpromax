const mongoose = require("mongoose");
const Product = require("./models/Product");

const uri = "mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus?appName=Cluster0";

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB ✅");

        const result = await Product.updateMany(
            { category: "IPTV & Sharing" },
            { $set: { category: "Abonnement IPTV" } }
        );

        console.log(`Updated ${result.modifiedCount} products from "IPTV & Sharing" to "Abonnement IPTV" 🚀`);

        // Also check if some products were using "IPTV Premium" and if they should be updated
        // Looking at admin.jsx diff, it seems they are consolidating.
        // But the request explicitly mentions "IPTV & Sharing".

        const result2 = await Product.updateMany(
            { category: "IPTV Premium" },
            { $set: { category: "Abonnement IPTV" } }
        );
        console.log(`Updated ${result2.modifiedCount} products from "IPTV Premium" to "Abonnement IPTV" 🚀`);

        // Also update GeneralSettings categories
        const GeneralSettings = require("./models/GeneralSettings");
        const settings = await GeneralSettings.findOne();
        if (settings && settings.categories) {
            let changed = false;
            settings.categories = settings.categories.map(cat => {
                if (cat.name === "IPTV & Sharing" || cat.name === "IPTV Premium") {
                    cat.name = "Abonnement IPTV";
                    cat.slug = "abonnement-iptv";
                    cat.title = "Abonnement IPTV";
                    changed = true;
                }
                return cat;
            });
            if (changed) {
                settings.markModified('categories');
                await settings.save();
                console.log("Updated GeneralSettings categories ✅");
            }
        }

    } catch (error) {
        console.error("Error during update:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB 🔌");
    }
}

run();
