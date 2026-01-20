const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop musik dan keluar dari voice channel'),
    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player) {
            return await interaction.reply({ content: '⚠️ Tidak ada player aktif.', ephemeral: true });
        }

        player.destroy();

        const embed = new EmbedBuilder()
            .setTitle('🛑 Musik Berhenti')
            .setDescription('Player dimatikan dan keluar dari voice channel.')
            .setColor('Red');

        await interaction.reply({ embeds: [embed] });
    },
};
