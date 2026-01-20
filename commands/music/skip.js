const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Lewati lagu sekarang'),
    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return await interaction.reply({ content: '⚠️ Tidak ada lagu yang sedang diputar.', ephemeral: true });
        }

        player.skip();

        const embed = new EmbedBuilder()
            .setTitle('⏭️ Lagu Dilewati')
            .setDescription(`Berhasil melewati lagu saat ini.`)
            .setColor('Orange');

        await interaction.reply({ embeds: [embed] });
    },
};
