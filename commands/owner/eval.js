const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const util = require('util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Execute JavaScript code (Owner Only)')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to execute')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== interaction.client.config.OWNER_ID) {
            return await interaction.reply({ content: '❌ **Akses Ditolak!** Perintah ini hanya untuk pemilik bot.', ephemeral: true });
        }

        const code = interaction.options.getString('code');
        await interaction.deferReply({ ephemeral: true });

        try {
            // Function to safely eval with access to interaction and client
            const evalAsync = async (c) => {
                return eval(c);
            };

            let result = await evalAsync(code);

            // Check if result is a promise and await it
            if (result instanceof Promise) {
                result = await result;
            }

            // Inspect the result
            let displayResult = util.inspect(result, { depth: 0 });

            // Censor tokens
            const token = interaction.client.token;
            if (token) {
                const regex = new RegExp(token, 'g');
                displayResult = displayResult.replace(regex, '[REDACTED]');
            }

            if (displayResult.length > 4000) {
                const buffer = Buffer.from(displayResult, 'utf-8');
                await interaction.editReply({
                    content: '✅ **Evaluated:** (Output attached because it was too long)',
                    files: [{ attachment: buffer, name: 'eval_output.txt' }]
                });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('💻 Eval Output')
                    .addFields(
                        { name: '📥 Input', value: `\`\`\`js\n${code.substring(0, 1000)}\n\`\`\`` },
                        { name: '📤 Output', value: `\`\`\`js\n${displayResult.substring(0, 1000)}\n\`\`\`` }
                    )
                    .setColor(displayResult.includes('Error') ? 'Red' : 'Green')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('❌ Eval Error')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code.substring(0, 1000)}\n\`\`\`` },
                    { name: '📤 Error', value: `\`\`\`js\n${error.toString().substring(0, 1000)}\n\`\`\`` }
                )
                .setColor('Red');

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
