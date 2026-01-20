const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Kunci channel agar member tidak bisa chat')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.channel;

        await interaction.deferReply();

        try {
            // Update permissions to deny SendMessages for @everyone
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            await interaction.followUp({ content: '🔒 **Channel Locked!** Member tidak bisa mengirim pesan sekarang.' });

        } catch (error) {
            console.error('[Lock Error]', error);
            await interaction.followUp({ content: '❌ Gagal mengunci channel. Pastikan bot punya izin `Manage Channels`.' });
        }
    },
};
