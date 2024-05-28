const { messageLink } = require("discord.js");
const member = require("../commands/utility/member");

module.exports = {
    name: 'myroles',
    description: 'Rollen Information',

    run: (bot, message, args) => {
        let roles = [];
        message.member.roles.cache.forEach((value) => {
            if(value.name != '@everyone'){
                roles.push(value.name);
            }

            
        });
        const roleMessage = roles.join('\n');

        message.reply(roleMessage);
    }
}
