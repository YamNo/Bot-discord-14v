const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Lempar koin (Head/Tail)'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? "🪙 KEPALA (Head)" : "🪙 EKOR (Tail)";
        await interaction.reply({ content: `Hasil lemparan: **${result}**` });
    },
};
