const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lihat antrian lagu'),
    async execute(interaction) {
        const player = interaction.client.manager.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setDescription('📭 Antrian saat ini kosong.').setColor('LightGrey')]
            });
        }

        const queue = player.queue;
        let desc = '';

        // Show current track
        // desc += `**Sedang Diputar:** [${queue.current.title}](${queue.current.uri})\n\n`;

        if (queue.length === 0) {
            desc += "Tidak ada lagu lain di antrian.";
        } else {
            for (let i = 0; i < queue.length; i++) {
                if (i >= 10) {
                    desc += `\n*...dan ${queue.length - 10} lagu lainnya.*`;
                    break;
                }
                const track = queue[i];
                desc += `\`${i + 1}.\` [${track.title}](${track.uri})\n`; // - \`${track.length}\` formatting needed
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`📜 Antrian Musik`)
            .setDescription(desc)
            .setColor('Blue');

        if (player.queue.current) {
            embed.setFooter({ text: `Sedang memutar: ${player.queue.current.title}` });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
