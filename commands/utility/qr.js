const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr')
        .setDescription('Ubah teks atau link menjadi kode QR')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Teks atau URL yang ingin diubah')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');

        // Encode URL parameters
        const encodedText = encodeURIComponent(text);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;

        const embed = new EmbedBuilder()
            .setTitle('📱 QR Code Generator')
            .setDescription(`Berikut adalah kode QR untuk:\n\`${text}\``)
            .setImage(qrUrl)
            .setColor('White')
            .setFooter({ text: 'Powered by goqr.me API' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
