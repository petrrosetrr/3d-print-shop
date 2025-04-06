import { Telegraf } from 'telegraf'
import { startCommand } from './commands/start'
import { handleOrders } from './handlers/orders'
import { handleNewOrder } from './handlers/new-order'
import { handleSupport } from './handlers/support'

export const bot = new Telegraf(process.env.TELEGRAM_TOKEN!)

// Команды
bot.start(startCommand)

// Обработка кнопок
bot.action('orders', handleOrders)
bot.action('new_order', handleNewOrder)
bot.action('support', handleSupport)
