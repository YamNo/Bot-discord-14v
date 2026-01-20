const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Cek jika ada error sistem (Owner Only)'),
    async execute(interaction) {
        // You might want to hardcode the owner ID or fetch from application
        if (interaction.user.id !== interaction.client.config.OWNER_ID) {
            return await interaction.reply({ content: '❌ **Akses Ditolak!** Perintah ini hanya untuk pemilik bot.', ephemeral: true });
        }

        const latency = Math.round(interaction.client.ws.ping);
        const voiceConnections = interaction.client.voice.adapters.size || 0;
        // Note: checking voice connections depends on how checking is implemented for discord.js v14
        // Usually interaction.client.voice.adapters is a map of guildId -> adapter

        const embed = new EmbedBuilder()
            .setTitle('🛠️ System Debug Log')
            .setColor('Red')
            .addFields(
                { name: '📶 Latency', value: `\`${latency}ms\``, inline: true },
                { name: '🔌 Voice Connection', value: `Active Adapters: ${voiceConnections}`, inline: true },
                { name: '🧩 Commands Loaded', value: `\`${interaction.client.commands.size}\``, inline: false }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
