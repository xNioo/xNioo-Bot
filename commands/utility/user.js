const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informationen über den Nutzer'),
    async execute(interaction) {
        await interaction.reply(`Der Befehl wurde von ${interaction.user.username} ausgeführt und ist dem Server ${interaction.member.joinedAt} beigetreten.`);
    },
};