const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Link ke server pusat bantuan bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🆘 Pusat Bantuan (Support Center)')
            .setDescription('Butuh bantuan? Punya saran? Atau nemu bug?\nLangsung aja join server support kami lewat tombol di bawah!')
            .setColor('Blurple')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: 'Kami siap membantu 24/7 (kalau admin bangun)' });

        const button = new ButtonBuilder()
            .setLabel('🔗 Join Server Support')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/2ytmtVtrv3');

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
