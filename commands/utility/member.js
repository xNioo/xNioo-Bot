const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Mitglieder Zahl'),
    async execute(interaction) {
        await interaction.reply(`Der Server ${interaction.guild.name} hat ${interaction.guild.memberCount} Mitglieder.`);
    },
};