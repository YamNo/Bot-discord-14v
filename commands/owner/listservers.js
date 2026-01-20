const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listservers')
        .setDescription('List all servers the bot is in (Owner Only)'),
    async execute(interaction) {
        if (interaction.user.id !== interaction.client.config.OWNER_ID) {
            return await interaction.reply({ content: '❌ **Akses Ditolak!** Perintah ini hanya untuk pemilik bot.', ephemeral: true });
        }

        const guilds = interaction.client.guilds.cache.map(g => `• **${g.name}** | \`${g.id}\` | 👤 ${g.memberCount}`);

        const description = guilds.join('\n');

        if (description.length > 4090) {
            const buffer = Buffer.from(guilds.join('\n'), 'utf-8');
            return await interaction.reply({
                content: `Bot berada di **${guilds.length}** server. List terlampir karena terlalu panjang.`,
                files: [{ attachment: buffer, name: 'servers.txt' }],
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📑 Server List (${guilds.length})`)
            .setDescription(description || 'Bot belum masuk ke server manapun.')
            .setColor('Blue')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
