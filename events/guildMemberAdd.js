const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        // ID Channel Welcome
        const welcomeChannelId = '1403739221210042378';

        // 1. Detect Inviter
        let inviter = null;
        try {
            const cachedInvites = client.inviteCache ? client.inviteCache.get(member.guild.id) : null;
            const newInvites = await member.guild.invites.fetch();

            if (cachedInvites) {
                // Find the invite that has increased uses
                const usedInvite = newInvites.find(inv => {
                    const cached = cachedInvites.get(inv.code);
                    return cached && inv.uses > cached.uses;
                });

                inviter = usedInvite.inviter;
                // Update cache for this specific invite
                cachedInvites.set(usedInvite.code, { uses: usedInvite.uses, inviterId: usedInvite.inviter.id });

                // DATABASE UPDATE
                try {
                    const Invite = require('../schemas/Invite');
                    const InvitedMember = require('../schemas/InvitedMember');

                    // Update Inviter Stats
                    await Invite.findOneAndUpdate(
                        { guildId: member.guild.id, userId: inviter.id },
                        { $inc: { regular: 1 } },
                        { upsert: true, new: true }
                    );

                    // Track who invited this member
                    await InvitedMember.create({
                        guildId: member.guild.id,
                        memberId: member.id,
                        inviterId: inviter.id
                    });
                    console.log(`[Database] Recorded invite: ${inviter.tag} invited ${member.user.tag}`);
                } catch (dbErr) {
                    console.error('[Database] Read/Write Error:', dbErr);
                }
            }
            // Sync cache
            if (client.cacheInvites) client.cacheInvites(member.guild);
        } catch (err) {
            console.error('Invite Tracking Error:', err);
        }

        // 2. Determine Channel
        const channel = member.guild.channels.cache.get(welcomeChannelId) ||
            member.guild.systemChannel ||
            member.guild.channels.cache.find(ch => ch.name.includes('welcome')) ||
            member.guild.channels.cache.find(ch => ch.name.includes('general'));

        if (!channel) return;

        // 3. Build Message
        let message = `Halo ${member.toString()}, selamat datang di **${member.guild.name}**! Jangan lupa baca <#1439968568287694858> ya. 👋`;

        if (inviter) {
            message += `\n(Diundang oleh: **${inviter.tag || inviter.username}**)`;
        }

        try {
            await channel.send(message);
        } catch (error) {
            console.error(`Gagal mengirim welcome message di ${member.guild.name}:`, error);
        }
    },
};
