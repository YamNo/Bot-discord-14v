const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Cek harga aset kripto')
        .addStringOption(option =>
            option.setName('coin')
                .setDescription('Nama koin (contoh: bitcoin, ethereum, dogecoin)')
                .setRequired(true)),
    async execute(interaction) {
        const coin = interaction.options.getString('coin').toLowerCase();
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,idr&include_24hr_change=true`);

            if (!response.data[coin]) {
                return await interaction.followUp({ content: '❌ Koin tidak ditemukan. Pastikan nama koin benar (contoh: bitcoin).' });
            }

            const data = response.data[coin];
            const usd = data.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const idr = data.idr.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
            const change = data.usd_24h_change.toFixed(2);
            const isAhd = data.usd_24h_change > 0;

            const embed = new EmbedBuilder()
                .setTitle(`💰 Harga ${coin.toUpperCase()}`)
                .setDescription(`Informasi harga terbaru untuk **${coin.toUpperCase()}**`)
                .setColor(isAhd ? '#00FF00' : '#FF0000') // Green for pump, Red for dump
                .addFields(
                    { name: '💵 USD', value: `\`${usd}\``, inline: true },
                    { name: '🇮🇩 IDR', value: `\`${idr}\``, inline: true },
                    { name: '📊 24h Change', value: `\`${change}%\` ${isAhd ? '📈' : '📉'}`, inline: true }
                )
                .setThumbnail(`https://assets.coingecko.com/coins/images/1/large/${coin}.png`) // Attempt to guess image or use generic
                .setFooter({ text: 'Data by CoinGecko • FahpsBot Finance' })
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Crypto Error]', error);
            await interaction.followUp({ content: '❌ Terjadi kesalahan saat mengambil data crypto. (API Error limit?)' });
        }
    },
};
