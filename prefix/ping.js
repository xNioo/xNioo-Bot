const { messageLink } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'this is the ping.',

    run: (bot, message, args) => {
        message.reply('pong!')
    }
}
