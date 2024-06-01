require('dotenv').config();
const {Client, Collection, Events, GatewayIntentBits, MessageCollector, MessageManager, Partials } = require('discord.js');
const config = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');

const bot = new Client({ 
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Reaction]
 });

bot.commands = new Collection();
bot.prefix = new Map();
const reactionHandlers = {};
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const prefixFolders = fs.readdirSync("./prefix").filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const { TOKEN } = process.env;
const { prefix, name } = config;
 
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
	  bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
	  bot.on(event.name, (...args) => event.execute(...args, bot));
	}
  }


// console info if bot is online
bot.once('ready', () => {
	console.info(`Angemeldet mit ${bot.user.tag}`);
});


// looking for the needed prefix command in its folder
for (arx of prefixFolders) {
	const Cmd = require('./prefix/' + arx)
	bot.prefix.set(Cmd.name, Cmd)
}

// Bot can write a reply for prefix commands
bot.on('messageCreate', async message => {
	const prefix = '!';
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const prefix_command = args.shift().toLocaleLowerCase();
	const prefixcmd = bot.prefix.get(prefix_command);
if (prefixcmd) {
	prefixcmd.run(bot, message, args)
};
});

// implements slashcommands and looking for needed command in it folders if someone writes a slashcommand in discord
bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});







bot.login(TOKEN);
