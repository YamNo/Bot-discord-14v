const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Cek seberapa lama bot sudah menyala'),
    async execute(interaction) {
        const uptimeSeconds = Math.floor(interaction.client.uptime / 1000);
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor(((uptimeSeconds % 86400) % 3600) / 60);
        const seconds = Math.floor(((uptimeSeconds % 86400) % 3600) % 60);

        const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder()
            .setTitle('🚀 Bot Status')
            .setDescription('Info performa bot saat ini:')
            .setColor('Green')
            .addFields(
                { name: '⏱️ Uptime', value: `\`${uptimeStr}\``, inline: true },
                { name: '📶 Latency', value: `\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true }
            )
            .setFooter({ text: `Online sejak: ${new Date(Date.now() - interaction.client.uptime).toLocaleString()}` });

        await interaction.reply({ embeds: [embed] });
    },
};
