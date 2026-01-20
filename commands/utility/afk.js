const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set status AFK. Bot akan membalas orang yang mention kamu.')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Alasan AFK')
                .setRequired(false)),
    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'Sedang sibuk';

        // Initialize afk collection if not exists
        if (!interaction.client.afkUsers) {
            interaction.client.afkUsers = new Map();
        }

        interaction.client.afkUsers.set(interaction.user.id, reason);

        const embed = new EmbedBuilder()
            .setDescription(`💤 **${interaction.user.username}** sekarang set status **AFK**.\n📝 Alasan: \`${reason}\``)
            .setColor('DarkGrey');

        await interaction.reply({ embeds: [embed] });
    },
};
