const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Ambil meme random dari Reddit'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            // Handle NSFW content if channel is not NSFW (optional logic, but good practice)
            if (meme.nsfw && !interaction.channel.nsfw) {
                return await interaction.followUp({ content: '❌ Meme yang didapat mengandung konten NSFW dan tidak dapat ditampilkan di channel ini.' });
            }

            const embed = new EmbedBuilder()
                .setTitle(meme.title)
                .setURL(meme.postLink)
                .setImage(meme.url)
                .setFooter({ text: `👍 ${meme.ups} • r/${meme.subreddit} • Author: ${meme.author} • FahpsBot Fun` })
                .setColor('#2B2D31')
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error('[Meme Error]', error);
            await interaction.followUp({ content: '❌ Gagal mengambil meme. Coba lagi nanti!' });
        }
    },
};
