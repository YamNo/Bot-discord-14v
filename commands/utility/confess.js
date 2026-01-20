const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confess')
        .setDescription('Kirim pesan anonim ke channel Confess')
        .addStringOption(option =>
            option.setName('pesan')
                .setDescription('Isi Confess kamu')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tujuan (opsional, default: channel ini)')),
    async execute(interaction) {
        const pesan = interaction.options.getString('pesan');
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // Check if channel is text-based
        if (!channel.isTextBased()) {
            return await interaction.reply({ content: '❌ Channel tujuan harus berupa text channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('📩 Pesan Anonim')
            .setDescription(pesan)
            .setColor('Purple')
            .setTimestamp()
            .setFooter({ text: 'Pesan Anonim' });

        try {
            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ Pesan anonim terkirim ke ${channel.toString()}!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `❌ Gagal mengirim pesan: ${error.message}`, ephemeral: true });
        }
    },
};
