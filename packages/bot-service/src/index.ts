import { config } from 'dotenv'
import { bot } from './bot'

config()

bot.launch()
console.log('🚀 Bot started')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
