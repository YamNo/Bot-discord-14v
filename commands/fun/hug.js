const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Peluk seseorang! 🤗')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Orang yang ingin kamu peluk')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        // Cannot hug yourself logic (optional, but cute)
        // if (target.id === interaction.user.id) return interaction.reply('Kamu butuh pelukan? Sini aku peluk! 🤗');

        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.waifu.pics/sfw/hug');
            const gifUrl = response.data.url;

            const embed = new EmbedBuilder()
                .setDescription(`🤗 **${interaction.user.username}** memeluk **${target.username}**!`)
                .setImage(gifUrl)
                .setColor('Random')
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Hug API Error]', error);
            await interaction.followUp({ content: '❌ Gagal mengambil GIF pelukan. (API Error)' });
        }
    },
};
