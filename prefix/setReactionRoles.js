const { messageLink } = require("discord.js");
let prefixName = 'setReactionRoles'

module.exports = {
    name: prefixName.toLocaleLowerCase(),
    description: 'set previous Message to react roles.',

    run: (bot, message, args) => {
        const requestMessage = message.content.replace('!setReactionRoles ','');

        if (requestMessage === 'age') {
            let newAge = message.id;
        }
        else {
            console.log('no function found :D');
        }
    }
}
