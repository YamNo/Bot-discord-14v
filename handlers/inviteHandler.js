const { Collection } = require('discord.js');

module.exports = (client) => {
    // Cache to store invites: Map<GuildID, Collection<InviteCode, Invite>>
    client.inviteCache = new Map();

    // Function to fetch and cache invites for a guild
    client.cacheInvites = async (guild) => {
        try {
            const invites = await guild.invites.fetch();
            // Store simple object to save memory: { code, uses, inviterId }
            const codeUses = new Collection();
            invites.each(inv => codeUses.set(inv.code, { uses: inv.uses, inviterId: inv.inviter?.id }));

            client.inviteCache.set(guild.id, codeUses);
            console.log(`[Invite Cache] Cached ${invites.size} invites for ${guild.name}`);
        } catch (e) {
            console.error(`[Invite Cache] Failed to cache for ${guild.name}:`, e.message);
        }
    };

    // Initialize cache on ready
    client.on('ready', () => {
        client.guilds.cache.forEach(guild => {
            client.cacheInvites(guild);
        });
    });

    // Handle Invite Create
    client.on('inviteCreate', (invite) => {
        const cachedInvites = client.inviteCache.get(invite.guild.id);
        if (cachedInvites) {
            cachedInvites.set(invite.code, { uses: invite.uses, inviterId: invite.inviter?.id });
        }
    });

    // Handle Invite Delete
    client.on('inviteDelete', (invite) => {
        const cachedInvites = client.inviteCache.get(invite.guild.id);
        if (cachedInvites) {
            cachedInvites.delete(invite.code);
        }
    });
};
