const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.commandArray = [];
    const commandsPath = path.join(__dirname, '../commands');

    if (fs.existsSync(commandsPath)) {
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(folderPath, file);
                    const command = require(filePath);

                    if ('data' in command && 'execute' in command) {
                        command.category = folder; // Store folder name as category
                        client.commands.set(command.data.name, command);
                        client.commandArray.push(command.data.toJSON());
                        console.log(`[CMD] Loaded /${command.data.name} (${folder})`);
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }
                }
            }
        }
    }
};
