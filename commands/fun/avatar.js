const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lihat foto profil user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User yang ingin dilihat (opsional)')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;

        const embed = new EmbedBuilder()
            .setTitle(`📸 Avatar ${target.username}`)
            .setColor('Random')
            .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }));

        await interaction.reply({ embeds: [embed] });
    },
};
