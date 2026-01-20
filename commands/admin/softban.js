const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Ban lalu Unban instan (Hapus semua chat user)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User yang ingin di-softban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Alasan softban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(target.id).catch(() => null);

        if (!member) {
            return await interaction.reply({ content: '❌ User tidak ditemukan di server ini.', ephemeral: true });
        }

        if (!member.bannable) {
            return await interaction.reply({ content: '❌ Saya tidak bisa ban user ini (Role mereka lebih tinggi atau setara).', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            // Ban with 7 days of message deletion
            await member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Softban: ${reason}` });

            // Immediately Unban
            await interaction.guild.members.unban(target.id, 'Softban complete');

            await interaction.followUp({ content: `🧹 **Softban Berhasil!** User **${target.tag}** telah di-kick dan pesan mereka (7 hari terakhir) dihapus.` });

        } catch (error) {
            console.error('[Softban Error]', error);
            await interaction.followUp({ content: '❌ Terjadi kesalahan saat melakukan softban.' });
        }
    },
};
