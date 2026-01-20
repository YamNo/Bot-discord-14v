const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Berikan ciuman! 💋')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Orang yang ingin kamu cium')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.waifu.pics/sfw/kiss');
            const gifUrl = response.data.url;

            const embed = new EmbedBuilder()
                .setDescription(`💋 **${interaction.user.username}** mencium **${target.username}**!`)
                .setImage(gifUrl)
                .setColor('Random')
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Kiss API Error]', error);
            await interaction.followUp({ content: '❌ Gagal mengambil GIF ciuman. (API Error)' });
        }
    },
};
