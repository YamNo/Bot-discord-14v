// Load Config
const config = require('./config');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Initialize Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Collections
client.commands = new Collection();
client.config = config; // Make config accessible via client

// Lavalink Nodes
const Nodes = [{
    name: 'Jirayu SSL',
    url: 'lavalinkv4.serenetia.com', // Port 443 for HTTPS/SSL
    auth: 'https://dsc.gg/ajidevserver',
    secure: true
}];

// Load Database
// require('./handlers/databaseHandler')(client); // Removed: Loaded dynamically below

// Load Handlers
const handlersPath = path.join(__dirname, 'handlers');
if (fs.existsSync(handlersPath)) {
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
    for (const file of handlerFiles) {
        require(path.join(handlersPath, file))(client);
    }
}

// Error Handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on('error', error => {
    console.error('Discord Client Error:', error);
});

client.login(config.DISCORD_TOKEN);
