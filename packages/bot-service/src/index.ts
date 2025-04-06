import { config } from 'dotenv'

config({})
config({ path: './.env.local', override: true })

const bot = await import('./bot').then((m) => m.bot)
console.log('🚀 Bot started')
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
