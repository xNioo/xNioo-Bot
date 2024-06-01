const roles = require('../messageRoles.json');
const config = require('../config.json');

module.exports = {
 name: 'messageReactionRemove',
 async execute(reaction, user, bot) {
     if (!user.bot) {
        const messageRoles = roles.messages[reaction.message.id];
        console.log('reaction removed!');
        if (!messageRoles) return;
        const roleId = messageRoles[reaction.emoji.name];
        if (!roleId) return;

        const guild = bot.guilds.cache.get(config.guildId);
        const member = guild.members.cache.get(user.id);
        const role = guild.roles.cache.get(roleId);

        if (member && role) {
        await member.roles.remove(role);
        console.log(`Removed role ${role.name} to user ${user.tag}`);
     }
   }
 },
};