const { Events, EmbedBuilder } = require('discord.js');
const PseudoInteraction = require('../utils/PseudoInteraction');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;

        // Prefix Handling (f!)
        const prefix = 'f!';
        if (message.content.toLowerCase().startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);

            if (command) {
                // Rule: Prefix (f!) is ONLY for Music commands
                if (command.category !== 'music') {
                    // Optional: Reply telling them to use slash command
                    // message.reply('❌ Gunakan Slash Command (`/`) untuk perintah ini.');
                    return;
                }

                try {
                    const { logCommand } = require('../utils/logger');
                    logCommand(client, commandName, message.author, message.guild, message.channel, 'Prefix Command');

                    const pseudoInteraction = new PseudoInteraction(message, args);
                    await command.execute(pseudoInteraction);
                } catch (error) {
                    console.error(error);
                    message.reply('❌ Terjadi kesalahan saat menjalankan perintah.');
                }
                return; // Stop further processing if command found
            }
        }

        // Ensure afkUsers map exists
        if (!client.afkUsers) client.afkUsers = new Map();

        // 1. Remove AFK if user types
        if (client.afkUsers.has(message.author.id)) {
            // Ignore if the message is running the afk command itself
            if (message.content.toLowerCase().startsWith('f!afk')) return;

            const reason = client.afkUsers.get(message.author.id);
            client.afkUsers.delete(message.author.id);

            const embed = new EmbedBuilder()
                .setDescription(`👋 Selamat datang kembali, **${message.author.username}**! Status AFK dihapus.`)
                .setColor('Green');

            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => msg.delete().catch(() => { }), 10000);
        }

        // 2. Check mentions
        if (message.mentions.users.size > 0) {
            message.mentions.users.forEach(async (user) => {
                if (client.afkUsers.has(user.id)) {
                    const reason = client.afkUsers.get(user.id);

                    const embed = new EmbedBuilder()
                        .setDescription(`💤 **${user.username}** sedang AFK saat ini.`)
                        .addFields({ name: 'Reason', value: reason })
                        .setFooter({ text: 'Mohon tunggu sampai dia kembali.' })
                        .setColor('Orange');

                    await message.reply({ embeds: [embed] });
                }
            });
        }
    },
};
