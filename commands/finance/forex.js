const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forex')
        .setDescription('Konversi mata uang asing')
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('Jumlah uang')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('Dari mata uang (contoh: USD)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Ke mata uang (contoh: IDR)')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');
        const from = interaction.options.getString('from').toUpperCase();
        const to = interaction.options.getString('to').toUpperCase();

        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
            const result = response.data.rates[to];

            if (!result) {
                return await interaction.followUp({ content: `❌ Tidak dapat mengonversi dari ${from} ke ${to}.` });
            }

            const formattedResult = result.toLocaleString('id-ID', { style: 'currency', currency: to });

            const embed = new EmbedBuilder()
                .setTitle('💱 Konversi Mata Uang')
                .setColor('#2B2D31')
                .addFields(
                    { name: '📥 Dari', value: `**${amount} ${from}**`, inline: true },
                    { name: '📤 Menjadi', value: `**${formattedResult}**`, inline: true }
                )
                .setFooter({ text: 'Data by Frankfurter • FahpsBot Finance' })
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Forex Error]', error);
            await interaction.followUp({ content: '❌ Gagal mengambil data kurs. Pastikan kode mata uang benar (contoh: USD, IDR, EUR).' });
        }
    },
};
