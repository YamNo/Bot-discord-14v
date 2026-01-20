const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');

module.exports = (client) => {
    // Lavalink Nodes
    const Nodes = [{
        name: 'Jirayu SSL',
        url: 'lavalinkv4.serenetia.com', // Port 443 for HTTPS/SSL
        auth: 'https://dsc.gg/ajidevserver',
        secure: true
    }];

    // Initialize Kazagumo
    const kazagumo = new Kazagumo({
        defaultSearchEngine: 'youtube', // or 'youtube_music', 'soundcloud'
        send: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        }
    }, new Connectors.DiscordJS(client), Nodes);

    // Attach to client
    client.manager = kazagumo;

    // Events (Optional: Add basic events for debugging)
    client.manager.shoukaku.on('ready', (name) => console.log(`[Lavalink] Node ${name} is ready!`));
    client.manager.shoukaku.on('error', (name, error) => console.error(`[Lavalink] Node ${name} error:`, error));
    client.manager.shoukaku.on('close', (name, code, reason) => console.warn(`[Lavalink] Node ${name} closed: ${code} ${reason}`));
    client.manager.shoukaku.on('disconnect', (name, players, moved) => {
        if (moved) return;
        players.map(player => player.connection.disconnect());
        console.warn(`[Lavalink] Node ${name} disconnected`);
    });
};
