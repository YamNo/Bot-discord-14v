const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Setup panel tiket support')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎫  HELP CENTER')
            .setDescription('Silakan buka tiket jika Anda memiliki keperluan berikut:\n👮 Laporan: Melaporkan member toxic, spam, atau pelanggaran aturan.\n🤝 Kerjasama: Ingin mengajukan partnership atau kolaborasi.\n❓ Tanya Jawab: Pertanyaan seputar server yang bers')
            .addFields(
                { name: '⏰  Response Time', value: 'Within 24 Hours', inline: true },
                { name: '📅  Working Hours', value: '24/7 Support', inline: true }
            )
            .setColor('#5865F2') // Blurple
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: 'Secure & Private Support', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setEmoji('📩')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ Panel tiket berhasil didesain ulang!', ephemeral: true });
    },
};
