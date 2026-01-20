const { EmbedBuilder } = require('discord.js');

class PseudoInteraction {
    constructor(message, args) {
        this.message = message;
        this.args = args;
        this.client = message.client;
        this.user = message.author;
        this.member = message.member;
        this.guild = message.guild;
        this.channel = message.channel;
        this.guildId = message.guildId;
        this.createdTimestamp = message.createdTimestamp;
        this.id = message.id; // Not a real interaction ID but useful
        this.replied = false;
        this.deferred = false;

        // Mock options
        this.options = {
            getString: (name) => {
                // Return entire remaining string for simple args or try to parse
                // For "play query", args are [query, ...]
                // This is naive parsing. For better parsing we need to know the command structure.
                // Assuming most commands take one string arg or we join all args.
                if (this.args.length === 0) return null;
                return this.args.join(' ');
                // Note: accurate parsing requires knowing the command definition. 
                // For now, we assume simple single-string commands like play, say, etc.
            },
            getUser: (name) => {
                if (message.mentions.users.size > 0) return message.mentions.users.first();
                return null;
            },
            getChannel: (name) => {
                if (message.mentions.channels.size > 0) return message.mentions.channels.first();
                return null;
            },
            getRole: (name) => {
                if (message.mentions.roles.size > 0) return message.mentions.roles.first();
                return null;
            }
        };
    }

    async reply(options) {
        this.replied = true;
        // Handle ephemeral
        if (options.ephemeral) {
            // Can't do real ephemeral in text, maybe DM? Or just send normal.
            // Just send normal for now or delete after time.
            delete options.ephemeral;
        }
        return await this.message.reply(options);
    }

    async deferReply(options) {
        this.deferred = true;
        return await this.message.channel.sendTyping();
    }

    async editReply(options) {
        // Since we can't edit the original "thinking" state easily without keeping reference to a message,
        // we'll just send a new message for now, OR we could try to send a placeholder in deferReply?
        // Simpler: Just send a reply.
        return await this.message.reply(options);
    }

    async followUp(options) {
        if (options.ephemeral) delete options.ephemeral;
        return await this.message.channel.send(options);
    }
}

module.exports = PseudoInteraction;
