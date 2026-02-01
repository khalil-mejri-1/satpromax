const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
    try {
        await mongoose.connect('mongodb+srv://Satpromax989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/Satpromax?appName=Cluster0');
        console.log('Connected to MongoDB');

        const products = await Product.find();
        let updatedCount = 0;

        for (const p of products) {
            const price = p.price || '';
            if (!price.toLowerCase().includes('dt')) {
                p.price = price.trim() + ' DT';
                await p.save();
                console.log(`Updated: ${p.name} -> ${p.price}`);
                updatedCount++;
            }
        }

        console.log(`Finished. Updated ${updatedCount} products.`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
