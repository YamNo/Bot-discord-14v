const { WebhookClient, EmbedBuilder } = require('discord.js');

const logCommand = async (client, commandName, user, guild, channel, type = 'Slash Command') => {
    if (!client.config.LOG_WEBHOOK_URL || client.config.LOG_WEBHOOK_URL.includes('YOUR_WEBHOOK_ID')) return;

    try {
        const webhook = new WebhookClient({ url: client.config.LOG_WEBHOOK_URL });

        const embed = new EmbedBuilder()
            .setTitle(`🤖 Command Log: ${commandName}`)
            .addFields(
                { name: '👤 User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: '📍 Channel', value: `${channel ? channel.name : 'DM'} (\`${channel ? channel.id : 'N/A'}\`)`, inline: true },
                { name: '🏠 Server', value: `${guild ? guild.name : 'DM'} (\`${guild ? guild.id : 'N/A'}\`)`, inline: true },
                { name: '⚡ Type', value: type, inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setColor('Blue')
            .setTimestamp();

        if (guild && guild.iconURL()) {
            embed.setThumbnail(guild.iconURL());
        }

        await webhook.send({
            username: client.user.username + ' Logger',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed]
        });
    } catch (error) {
        console.error('[Logger] Failed to send webhook log:', error.message);
    }
};

module.exports = { logCommand };
