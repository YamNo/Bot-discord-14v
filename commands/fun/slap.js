const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Tampar member lain!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Orang yang ingin ditampar')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const gifs = [
            "https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif"
        ];

        const embed = new EmbedBuilder()
            .setDescription(`👋 **${interaction.user.username}** menampar **${target.username}**! Aduh sakit...`)
            .setColor('Red')
            .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

        await interaction.reply({ embeds: [embed] });
    },
};
