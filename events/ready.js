const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Register Commands
        if (client.commandArray && client.commandArray.length > 0) {
            try {
                console.log('Registering commands globally...');
                await client.application.commands.set(client.commandArray);
                console.log('Successfully registered application commands globally.');
            } catch (error) {
                console.error(error);
            }
        }

        // Status Loop
        const statuses = [
            { name: "Join Now Lumina Community 🌟", type: ActivityType.Custom },
            { name: "Mabar Yuk! 🎮", type: ActivityType.Custom }, // Custom doesn't always show the same way as Playing
            { name: "f!help | /help", type: ActivityType.Custom }
        ];

        let i = 0;
        // Initial set
        const updateStatus = () => {
            const status = statuses[i];
            client.user.setPresence({
                activities: [{ name: status.name, type: status.type }],
                status: 'idle'
            });
            i = (i + 1) % statuses.length;
        };

        updateStatus();
        setInterval(updateStatus, 10000); // 10 seconds
    },
};
