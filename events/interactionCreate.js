const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Rule: Slash Command (/) is NOT for Music commands
        if (command.category === 'music') {
            return await interaction.reply({
                content: '❌ Fitur musik hanya mendukung prefix `f!` (Contoh: `f!play`).',
                ephemeral: true
            });
        }

        try {
            const { logCommand } = require('../utils/logger');
            logCommand(client, interaction.commandName, interaction.user, interaction.guild, interaction.channel, 'Slash Command');

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
