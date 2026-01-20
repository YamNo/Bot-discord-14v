const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Beri nilai 0-100 untuk sesuatu')
        .addStringOption(option =>
            option.setName('stuff')
                .setDescription('Hal yang ingin dinilai')
                .setRequired(true)),
    async execute(interaction) {
        const stuff = interaction.options.getString('stuff');
        const rating = Math.floor(Math.random() * 101);
        let emoji = "⭐";
        if (rating > 80) emoji = "🔥";
        else if (rating < 20) emoji = "💩";

        await interaction.reply({ content: `Menurut saya, **${stuff}** itu nilainya: **${rating}/100** ${emoji}` });
    },
};
