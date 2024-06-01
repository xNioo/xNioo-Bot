const { messageLink } = require("discord.js");

module.exports = async (reaction, user, aor) => {
    // aor = added or removed
    // reaction add: aor = 1 
    // reaction remove: aor = 2
    const guild = reaction.message.guild;

    const member = await guild.members.fetch(user.id);
    
    if (reaction.emoji.name === '🔴' ) {
        if(aor === 1) {
            await member.roles.add('1246113555682431067');
            console.log('added');
        }
        else if(aor === 2) {
            await member.roles.remove('1246113555682431067');
            console.log('removed');
        }
        console.log('alter');
    }


    console.log(`Message2: ${user.tag} reaction change : ${reaction.emoji.name}`);
};