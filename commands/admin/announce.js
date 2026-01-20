const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Buat pengumuman dengan Embed yang keren!')
        .addStringOption(option => option.setName('title').setDescription('Judul pengumuman').setRequired(true))
        .addStringOption(option => option.setName('content').setDescription('Isi pesan pengumuman').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Channel tujuan').setRequired(false))
        .addStringOption(option => option.setName('image').setDescription('URL Gambar/GIF').setRequired(false))
        .addRoleOption(option => option.setName('role').setDescription('Role yang ingin di-mention').setRequired(false))
        .addStringOption(option => option.setName('footer').setDescription('Teks footer').setRequired(false))
        .addStringOption(option => option.setName('color').setDescription('Warna embed (Hex code/Random)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const content = interaction.options.getString('content');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const image = interaction.options.getString('image');
        const role = interaction.options.getRole('role');
        const footer = interaction.options.getString('footer');
        const colorInput = interaction.options.getString('color');

        if (!channel.isTextBased()) {
            return await interaction.reply({ content: '❌ Channel tujuan harus berupa text channel.', ephemeral: true });
        }

        // Permissions check
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionFlagsBits.SendMessages)) {
            return await interaction.reply({ content: `❌ Saya tidak punya izin mengirim pesan di ${channel.toString()}!`, ephemeral: true });
        }

        let embedColor = 'Blue';
        if (colorInput) {
            if (colorInput.toLowerCase() === 'random') {
                embedColor = 'Random';
            } else if (colorInput.startsWith('#')) {
                embedColor = colorInput;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(content)
            .setColor(embedColor)
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL());

        if (image) embed.setImage(image);

        if (footer) {
            embed.setFooter({ text: `FahpsBot`, iconURL: interaction.user.displayAvatarURL() });
        }

        let msgContent = "";
        if (role) {
            msgContent = role.toString();
        }

        try {
            await channel.send({ content: msgContent || null, embeds: [embed] });
            await interaction.reply({ content: `✅ Pengumuman berhasil dikirim ke ${channel.toString()}!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `❌ Gagal mengirim pengumuman: ${error.message}`, ephemeral: true });
        }
    },
};
