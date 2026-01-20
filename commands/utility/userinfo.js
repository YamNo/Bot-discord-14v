const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Menampilkan informasi lengkap user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User yang ingin dicek (opsional)')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.guild) {
            return await interaction.reply({ content: '❌ Perintah ini hanya bisa digunakan di dalam server.', ephemeral: true });
        }

        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);

        const start = Date.now();
        // Calculate roles (filtering @everyone)
        const roles = member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .slice(0, 10) // Top 10 roles
            .join(', ') || 'Tidak ada role';

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Informasi Pengguna: ${target.username}`, iconURL: target.displayAvatarURL() })
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#2B2D31')
            .addFields(
                { name: '🆔 User ID', value: `\`${target.id}\``, inline: true },
                { name: '🏷️ Tag', value: `**${target.tag}**`, inline: true },
                { name: '📅 Dibuat Pada', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:D> (<t:${Math.floor(target.createdTimestamp / 1000)}:R>)`, inline: false },
                { name: '📥 Bergabung Pada', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline: false },
                { name: '🛡️ Role Utama', value: `${member.roles.highest}`, inline: true },
                { name: '🎭 Daftar Role', value: roles, inline: false },
                { name: '🚀 Server Booster', value: member.premiumSince ? `Sejak <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : '✖️ Tidak', inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.username} • FahpsBot` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
