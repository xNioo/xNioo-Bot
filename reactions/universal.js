const { messageLink } = require("discord.js");

// for new reaction functions add the file name to the switch case in both events (ReactionAdd and ReactionRemove)
// also link the special message Id in the case

module.exports = async (reaction, user, aor) => {
    // aor = added or removed
    // reaction add: aor = 1 
    // reaction remove: aor = 2
    const guild = reaction.message.guild;

    const member = await guild.members.fetch(user.id);
    
    if (reaction.emoji.name === '' ) {
        if(aor === 1) {
            await member.roles.add('');
            console.log('added');
        }
        else if(aor === 2) {
            await member.roles.remove('');
            console.log('removed');
        }
        console.log('');
    }


    console.log(`Message2: ${user.tag} reaction change : ${reaction.emoji.name}`);
};