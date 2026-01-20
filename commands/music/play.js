const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Putar lagu dari YouTube/SoundCloud (Lavalink)')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Judul lagu atau URL')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const { channel } = interaction.member.voice;

        if (!channel) {
            return await interaction.reply({ content: '❌ Kamu harus masuk voice channel dulu!', ephemeral: true });
        }

        /* 
           Permissions check here if needed (CONNECT, SPEAK)
        */

        await interaction.deferReply();

        // Create or get player
        // Note: Kazagumo uses "createPlayer"
        const player = await interaction.client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: channel.id,
            shardId: interaction.guild.shardId,
            volume: 100,
            deaf: true
        });

        try {
            const result = await interaction.client.manager.search(query, { requester: interaction.user });

            if (!result.tracks.length) {
                return await interaction.followUp({ content: '❌ Tidak ditemukan hasil.' });
            }

            if (result.type === 'PLAYLIST') {
                for (const track of result.tracks) {
                    player.queue.add(track);
                }
                if (!player.playing && !player.paused) player.play();

                const embed = new EmbedBuilder()
                    .setTitle('💿 Playlist Ditambahkan')
                    .setDescription(`**${result.playlistName}**\n✅ ${result.tracks.length} lagu ditambahkan.`)
                    .setColor('Red');

                await interaction.followUp({ embeds: [embed] });

            } else {
                const track = result.tracks[0];
                player.queue.add(track);

                if (!player.playing && !player.paused) player.play();

                const embed = new EmbedBuilder()
                    .setTitle('🎵 Ditambahkan ke Antrian')
                    .setDescription(`**[${track.title}](${track.uri})**`)
                    .addFields(
                        { name: '👤 Artist', value: track.author || 'Unknown', inline: true },
                        { name: '⏳ Durasi', value: track.isStream ? 'LIVE' : new Date(track.length).toISOString().substr(14, 5), inline: true }
                    )
                    .setColor('Red');

                if (track.thumbnail) embed.setThumbnail(track.thumbnail);

                await interaction.followUp({ embeds: [embed] });
            }

        } catch (e) {
            console.error('[Play Command Error]', e);
            if (interaction.replied || interaction.deferred) {
                return await interaction.followUp({ content: `❌ Error: ${e.message}` });
            } else {
                return await interaction.reply({ content: `❌ Error: ${e.message}`, ephemeral: true });
            }
        }
    },
};
