const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Kalkulator matematika sederhana')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('Operasi matematika (contoh: 5 * 10)')
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        // Validation: Only allow numbers and math operators
        const validChars = /^[0-9+\-*/().\s%^]+$/;
        if (!validChars.test(expression)) {
            return await interaction.reply({
                content: '❌ Input tidak valid! Hanya mendukun angka dan operator: `+ - * / % ( ) . ^`',
                ephemeral: true
            });
        }

        try {
            // Evaluasi matematika yang aman (mengganti ^ menjadi **)
            const sanitizedExpression = expression.replace(/\^/g, '**');

            // Function constructor is safer than direct eval but still allows some execution, 
            // but strict regex above prevents injection of arbitrary code like "process.exit()".
            const result = new Function(`return ${sanitizedExpression}`)();

            const embed = new EmbedBuilder()
                .setTitle('🧮 Kalkulator')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`${expression}\`\`\`` },
                    { name: '📤 Hasil', value: `\`\`\`${result}\`\`\`` }
                )
                .setColor('Blue');

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menghitung. Pastikan format penulisan benar.',
                ephemeral: true
            });
        }
    },
};
