const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Pusat Bantuan Interaktif'),
    async execute(interaction) {
        const emojis = {
            admin: '🛡️',
            fun: '🎉',
            music: '🎵',
            utility: '🔧',
            owner: '👑',
            announcements: '📢',
            lainnya: '📦'
        };

        const descriptions = {
            admin: 'Perintah untuk staf administrasi',
            fun: 'Perintah hiburan dan permainan',
            music: 'Perintah pemutar musik',
            utility: 'Alat bantu dan informasi',
            owner: 'Khusus pemilik bot'
        };

        const commands = interaction.client.commands;
        const categories = {};

        // Group commands
        commands.forEach(cmd => {
            const category = cmd.category ? cmd.category.toLowerCase() : 'lainnya';
            if (!categories[category]) categories[category] = [];
            categories[category].push(`\`/${cmd.data.name}\``);
        });

        // Create Select Menu Options
        const options = Object.keys(categories).map(cat => ({
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: cat,
            description: descriptions[cat] || 'Kategori perintah lainnya',
            emoji: emojis[cat] || '📂'
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('Pilih kategori perintah...')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setTitle('✨ Pusat Bantuan FahpsBot')
            .setDescription('Silakan pilih kategori di bawah untuk melihat daftar perintah.\nBot ini dirancang untuk musik, utilitas, dan keseruan server!')
            .setColor('#2B2D31') // Dark aesthetic
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields({ name: '⚡ Tips', value: '> Gunakan `/` untuk melihat semua perintah secara instan.' })
            .setFooter({ text: `FahpsBot`, iconURL: interaction.client.user.displayAvatarURL() });

        const response = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        // Collector for interaction
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

        collector.on('collect', async i => {
            const selection = i.values[0];
            const cmdList = categories[selection];

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${emojis[selection] || '📂'}  Kategori: ${selection.charAt(0).toUpperCase() + selection.slice(1)}`)
                .setDescription(descriptions[selection] || 'Daftar perintah dalam kategori ini.')
                .setColor('Random')
                .addFields({ name: 'Perintah Tersedia:', value: cmdList.join(', ') || 'Tidak ada perintah.' })
                .setFooter({ text: 'Gunakan menu untuk mengganti kategori' });

            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on('end', () => {
            // Optional: Disable components after timeout
            // interaction.editReply({ components: [] }).catch(() => {});
        });
    },
};
