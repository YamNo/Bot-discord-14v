const mongoose = require('mongoose');

module.exports = async (client) => {
    if (!client.config.MONGO_URI) return;

    try {
        await mongoose.connect(client.config.MONGO_URI);
        console.log('[Database] Connected to MongoDB!');
    } catch (error) {
        console.error('[Database] Error connecting to MongoDB:', error);
    }
};
