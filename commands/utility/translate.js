const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Terjemahkan teks ke bahasa lain')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Teks yang ingin diterjemahkan')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Bahasa tujuan (kode negara, contoh: id, en, ja)')
                .setRequired(false)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const to = interaction.options.getString('to') || 'id';

        await interaction.deferReply();

        try {
            const res = await translate(text, { to: to });

            const embed = new EmbedBuilder()
                .setTitle('🌍 Terjemahan')
                .addFields(
                    { name: '📥 Dari', value: `\`${res.raw.src}\``, inline: true },
                    { name: '📤 Ke', value: `\`${to}\``, inline: true },
                    { name: '📝 Teks Asli', value: `\`\`\`\n${text}\n\`\`\`` },
                    { name: '✨ Hasil', value: `\`\`\`\n${res.text}\n\`\`\`` }
                )
                .setColor('Blue')
                .setFooter({ text: 'Powered by Google Translate' });

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Translate Error]', error);
            await interaction.followUp({ content: '❌ Gagal menerjemahkan. Coba lagi atau periksa kode bahasa.' });
        }
    },
};
