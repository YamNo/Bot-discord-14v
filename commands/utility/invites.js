const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Cek jumlah invite aktif (tidak akurat 100% tanpa database)')
        .addUserOption(option => option.setName('user').setDescription('User yang ingin dicek').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        await interaction.deferReply();

        try {
            const Invite = require('../../schemas/Invite');
            const inviteData = await Invite.findOne({ guildId: interaction.guild.id, userId: user.id });

            const regular = inviteData ? inviteData.regular : 0;
            const left = inviteData ? inviteData.left : 0;
            const fake = inviteData ? inviteData.fake : 0;
            const bonus = inviteData ? inviteData.bonus : 0;

            // Total = Regular + Bonus (Fake and Left usually subtracted from Regular already depending on logic, or shown separately)
            // Here Regular is what's displayed as "Active" usually. 
            // Let's display Total = Regular + Bonus. Regular already has (Joins - Leaves).
            const total = regular + bonus;

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${user.username}'s Invites`, iconURL: user.displayAvatarURL() })
                .setColor(total > 0 ? '#00FF00' : '#FF0000')
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '📨 Total Active', value: `**${total}**`, inline: true },
                    { name: '✅ Regular', value: `${regular}`, inline: true },
                    { name: '↩️ Left', value: `${left}`, inline: true },
                    { name: '✨ Bonus', value: `${bonus}`, inline: true }
                )
                .setDescription(`Statistik invite untuk **${user.toString()}**`)
                .setFooter({ text: 'FahpsBot Invite Tracker', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Terjadi kesalahan saat mengambil data invite.' });
        }
    },
};
