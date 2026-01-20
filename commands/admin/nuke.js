const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Hapus channel ini dan buat ulang (Membersihkan semua chat)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        // Confirmation button logic could be added, but for simplicity we'll just execute with a check.
        if (!interaction.channel) return;

        const channel = interaction.channel;
        const position = channel.position;

        await interaction.reply({ content: '💣 Nuking channel in 3 seconds...', ephemeral: true });

        setTimeout(async () => {
            try {
                // Clone the channel
                const newChannel = await channel.clone({ position: position });

                // Delete the old channel
                await channel.delete();

                // Send message in new channel
                const embed = new EmbedBuilder()
                    .setTitle('💣 Channel Nuked!')
                    .setDescription('Channel ini telah dibersihkan secara total.')
                    .setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
                    .setColor('Red')
                    .setTimestamp();

                await newChannel.send({ embeds: [embed] });

            } catch (error) {
                console.error('[Nuke Error]', error);
            }
        }, 3000);
    },
};
