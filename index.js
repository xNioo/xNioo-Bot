require('dotenv').config();
const {Client, Collection, Events, GatewayIntentBits, MessageCollector, MessageManager, Partials } = require('discord.js');
const config = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');
let aor = 0;

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
const reactionFolders = fs.readdirSync(path.join(__dirname, 'reactions')).filter(file => file.endsWith('.js'));

// add the reaction functions to the message ID
let gender = '1246073636784439410';
let age = '1246111806800531519';
// let platforms = message ID
// let games = message ID

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


// console info if bot is online
bot.once('ready', () => {
	console.info(`Angemeldet mit ${bot.user.tag}`);
});

for (const file of reactionFolders) {
	const handler = require(`./reactions/${file}`);
	const messageName = file.split('.')[0]; // Datei ohne .js
	reactionHandlers[messageName] = handler;
}

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

// to see if a message got a new reaction
bot.on(Events.MessageReactionAdd, async (reaction, user, aor, message) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

	const mId = reaction.message.id; 
	let rId = '';
	aor = 1;

	// switch case for reaction to special messages 
	// case 'messageID'
	switch (mId) {
		case gender:
			rId = 'gender';
			break;
		
		case age:
			rId = 'age';
			break;
			
		default:
			break;
	}
	if (!rId) {
		console.log('No function found!');
		return;
	}
	else {
		console.log('Nachricht erkannt');
		await reactionHandlers[rId](reaction, user, aor, message);
	}
	
});

// to see if a reaction is removed from a message
bot.on(Events.MessageReactionRemove, async (reaction, user, aor, message) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}
	
	// Bestimme die Nachricht und wende die entsprechende Reaktionsfunktion an
	const mId = reaction.message.id; 
	let rId = '';
	aor = 2;

	// switch case for reaction to special messages 
	// case 'messageID'
	switch (mId) {
		case gender:
			rId = 'gender';
			break;

		case age:
			rId = 'age';
			break;
	
		default:
			break;
	}
	if (rId === '') {
		console.log('No function found!');
		return;
	}
	else{
		await reactionHandlers[rId](reaction, user, aor, message);
	}
});





bot.login(TOKEN);
