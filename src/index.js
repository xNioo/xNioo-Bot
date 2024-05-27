require('dotenv').config()
const {Client, Events, GatewayIntentBits } = require('discord.js')
const config = require('../config.json')

const bot = new Client({ intents: [GatewayIntentBits.Guilds] })
const { TOKEN } = process.env

const { prefix, name } = config

bot.once('ready', () => {
    console.info(`Angemeldet mit ${bot.user.tag}`)
})

bot.login(TOKEN)
