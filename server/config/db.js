const mongoose = require("mongoose");

let isConnected = false;
let remoteConn = null;

// Dual-Database Sync Plugin
const syncPlugin = (schema) => {
    // Sync Save (New documents or direct save)
    schema.post('save', async function (doc) {
        if (!remoteConn) return;
        try {
            const RemoteModel = remoteConn.model(this.constructor.modelName, schema);
            await RemoteModel.findByIdAndUpdate(doc._id, doc.toObject(), { upsert: true, setDefaultsOnInsert: false });
        } catch (err) {
            console.error(`⚠️ [SYNC] Save mirror failed [${this.constructor.modelName}]:`, err.message);
        }
    });

    // Sync Updates (updateOne, findOneAndUpdate, updateMany)
    schema.post(['updateOne', 'findOneAndUpdate', 'updateMany'], async function () {
        if (!remoteConn) return;
        try {
            const query = this.getQuery();
            const update = this.getUpdate();
            const RemoteModel = remoteConn.model(this.model.modelName, schema);

            if (this.op === 'updateMany') {
                await RemoteModel.updateMany(query, update);
            } else {
                await RemoteModel.updateOne(query, update, { upsert: true });
            }
        } catch (err) {
            console.error(`⚠️ [SYNC] Update mirror failed [${this.model.modelName}]:`, err.message);
        }
    });

    // Sync Deletions (deleteOne, deleteMany, findOneAndDelete)
    schema.post(['deleteOne', 'deleteMany', 'findOneAndDelete'], async function () {
        if (!remoteConn) return;
        try {
            const query = this.getQuery();
            const RemoteModel = remoteConn.model(this.model.modelName, schema);

            if (this.op === 'deleteMany') {
                await RemoteModel.deleteMany(query);
            } else {
                await RemoteModel.deleteOne(query);
            }
        } catch (err) {
            console.error(`⚠️ [SYNC] Delete mirror failed [${this.model.modelName}]:`, err.message);
        }
    });
};

// Apply sync plugin globally to all models
mongoose.plugin(syncPlugin);

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
        // 1. Connect to Local DB (Primary for GET)
        await mongoose.connect("mongodb://127.0.0.1:27017/technoplus", options);
        console.log("🟢 [Local DB] Connected (Primary for Reads)");

        // 2. Connect to Remote DB (Secondary for Sync)
        remoteConn = mongoose.createConnection("mongodb+srv://technoplus989_db_user:r2G0uyv5WI19dZU6@cluster0.oxhvidw.mongodb.net/technoplus", options);
        remoteConn.on('connected', () => console.log('🔵 [Remote DB] Connected (Mirror for Writes)'));
        remoteConn.on('error', (err) => console.error('🔴 [Remote DB] Mirror Connection Error:', err));

        isConnected = true;
        console.log("🚀 [Dual-DB] Synchronization System Active ✅");
    } catch (error) {
        console.error("🔴 [MongoDB] Initial Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
