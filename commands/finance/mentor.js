const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mentor')
        .setDescription('Dapatkan motivasi investasi & trading'),
    async execute(interaction) {
        const quotes = [
            "“The stock market is designed to transfer money from the Active to the Patient.” – Warren Buffett",
            "“Risk comes from not knowing what you're doing.” – Warren Buffett",
            "“In investing, what is comfortable is rarely profitable.” – Robert Arnott",
            "“Know what you own, and know why you own it.” – Peter Lynch",
            "“Spending money to show people how much money you have is the fastest way to have less money.” – Morgan Housel",
            "“Compound interest is the eighth wonder of the world. He who understands it, earns it... he who doesn't... pays it.” – Albert Einstein"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        const embed = new EmbedBuilder()
            .setTitle('🧠 Mentor Keuangan')
            .setDescription(`*${randomQuote}*`)
            .setColor('#2B2D31')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/411/411763.png')
            .setFooter({ text: 'Investment Wisdom • FahpsBot Finance' });

        await interaction.reply({ embeds: [embed] });
    },
};
