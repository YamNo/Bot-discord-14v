const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { customId, guild, user } = interaction;

        // CREATE TICKET
        if (customId === 'create_ticket') {
            // Check if user already has a ticket
            const existingChannel = guild.channels.cache.find(ch => ch.name === `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
            if (existingChannel) {
                return await interaction.reply({ content: `❌ Anda sudah memiliki tiket: ${existingChannel.toString()}`, ephemeral: true });
            }

            try {
                const channel = await guild.channels.create({
                    name: `ticket-${user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles],
                        },
                        // Add Staff/Admin roles here if needed
                        {
                            id: interaction.client.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        }
                    ],
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Ticket Support: ${user.username}`, iconURL: user.displayAvatarURL() })
                    .setDescription('Terima kasih telah menghubungi kami! Staff kami akan segera merespons.\n\n👮 Laporan: Melaporkan member toxic, spam, atau pelanggaran aturan.\n🤝 Kerjasama: Ingin mengajukan partnership atau kolaborasi.\n❓ Tanya Jawab: Pertanyaan seputar server yang bersama.')
                    .setColor('#2ecc71') // Green success
                    .setFooter({ text: 'Klik tombol di bawah untuk mengelola tiket.' })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
                    );

                await channel.send({ content: `${user.toString()} Selamat datang!`, embeds: [embed], components: [row] });
                await interaction.reply({ content: `✅ Tiket dibuat: ${channel.toString()}`, ephemeral: true });

            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Gagal membuat tiket.', ephemeral: true });
            }
        }

        // CLOSE TICKET
        if (customId === 'close_ticket') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return await interaction.reply({ content: '❌ Command ini hanya bisa digunakan di channel ticket.', ephemeral: true });
            }

            await interaction.reply({ content: '🔒 Ticket akan dihapus dalam 5 detik...' });
            setTimeout(() => interaction.channel.delete().catch(() => { }), 5000);
        }
    },
};
