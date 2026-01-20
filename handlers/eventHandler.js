const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    if (fs.existsSync(eventsPath)) {
        const loadEvents = (dir) => {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            for (const file of files) {
                const fullPath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    loadEvents(fullPath);
                } else if (file.name.endsWith('.js')) {
                    const event = require(fullPath);
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    console.log(`[EVENT] Loaded ${event.name}`);
                }
            }
        };

        loadEvents(eventsPath);
    }
};
