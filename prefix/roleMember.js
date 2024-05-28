const { messageLink, RoleManager } = require("discord.js");
const member = require("../commands/utility/member");

module.exports = {
    name: 'roleMember',
    description: 'Angehörige einer Rolle',

    run: (bot, message, args) => {
       
        const requestMessage = message.content.replace('!roleMember ','');
        // console.log(requestMessage);
        let roleId = 0;
        message.guild.roles.cache.forEach((value, key) => {
            if(requestMessage.toLowerCase() === value.name.toLowerCase()) {
                roleId = key;
            }
        })
        // console.log(roleId);
        
       
        const guild = message.guild;
        const role = guild.roles.cache.get(roleId);


        if (roleId === 0) {
            return message.channel.send('Rolle nicht gefunden!');
        }

        const membersWithRole = role.members.map(member => member.user.displayName).join('\n');

        if (membersWithRole.length === 0) {
            return message.channel.send('Keine Mitglieder mit dieser Rolle gefunden.');
        }

        message.channel.send(`Mitglieder mit der Rolle ${role.name}:\n${membersWithRole}`);
    
    }
}
