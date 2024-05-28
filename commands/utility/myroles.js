const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myroles')
        .setDescription('Information zu den Rollen'),
    async execute(interaction) {
        console.log(interaction.member.roles.cache.value);
        // await interaction.reply(`${interaction.member.roles}`);
    },
};