const { messageLink, InteractionCollector, SlashCommandBuilder } = require("discord.js");
const { execute } = require("./member");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("react")
    .setDescription("look at reacts to the message"),

    async execute(message, client) {
        const botMessage = await message.reply({
            content: `React here!`,
            fetchReply: true,
        });
        // const emojiReact = bot.guilds.cache.emojis.find(emoji => emoji.id = '✅');

        botMessage.react('✅');

        const filter = (reaction) => {
            return reaction.emoji.name === '✅';
        };

        const collector = botMessage.createReactionCollector({ filter });

        collector.on('collect', (reaction, user) => {
            console.log(`Collecxted ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        })

    }
}