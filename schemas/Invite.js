const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    regular: { type: Number, default: 0 },
    fake: { type: Number, default: 0 },
    left: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 }
});

module.exports = mongoose.model('Invite', inviteSchema);
