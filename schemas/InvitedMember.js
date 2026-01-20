const mongoose = require('mongoose');

const invitedMemberSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    inviterId: { type: String, required: true },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InvitedMember', invitedMemberSchema);
