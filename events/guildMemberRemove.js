const { Events } = require('discord.js');
const Invite = require('../schemas/Invite');
const InvitedMember = require('../schemas/InvitedMember');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            // Find who invited this member
            const inviteData = await InvitedMember.findOne({ guildId: member.guild.id, memberId: member.id });

            if (inviteData) {
                const inviterId = inviteData.inviterId;

                // Update Inviter Stats: Decrement regular, Increment left
                await Invite.findOneAndUpdate(
                    { guildId: member.guild.id, userId: inviterId },
                    { $inc: { regular: -1, left: 1 } }
                );

                console.log(`[Database] Member left: ${member.user.tag} (Invited by ${inviterId}). Stats updated.`);

                // Optional: Delete the tracking record or keep it for history
                await InvitedMember.deleteOne({ _id: inviteData._id });
            }
        } catch (error) {
            console.error('[Database] Error processing member remove:', error);
        }
    },
};
