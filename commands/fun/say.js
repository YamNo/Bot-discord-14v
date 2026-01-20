const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bot akan mengulangi pesanmu')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Pesan yang ingin diulang')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');

        // Kirim pesan ke channel secara public
        await interaction.channel.send(message);

        // Beri konfirmasi ke user (hanya user yang lihat / Dismiss message)
        await interaction.reply({ content: '✅ Pesan terkirim!', ephemeral: true });
    },
};
