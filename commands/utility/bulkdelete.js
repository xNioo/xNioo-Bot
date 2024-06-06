const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bulkdelete')
        .setDescription('delete last 30 Messages'),
    async execute(interaction) {
        const rollcheck = interaction.member.roles.cache.has('676828303788867601');
        
        if (rollcheck === true){
            interaction.channel.bulkDelete(30);
            interaction.reply(`Bulk deleted 30 messages`);
        }
        else (
            await interaction.reply('command not found!')
        )
    },
};