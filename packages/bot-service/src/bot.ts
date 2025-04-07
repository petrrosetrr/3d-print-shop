import { session, Telegraf } from 'telegraf'
import { Stage, WizardContext } from 'telegraf/scenes'

import { startCommand } from './commands/start'
import { handleOrders } from './handlers/orders'
import { handleSupport } from './handlers/support'
import { newOrderScene } from './scenes/new-order.scene'

export const bot = new Telegraf<WizardContext>(process.env.TELEGRAM_TOKEN!)

// Сцены
const stage = new Stage<WizardContext>([newOrderScene])

bot.use(session())
bot.use(stage.middleware())

// Команды
bot.start(startCommand)

// Обработка кнопок
bot.action('orders', handleOrders)
bot.action('support', handleSupport)
bot.action('new_order', async (ctx) => {
  await ctx.answerCbQuery()
  await ctx.scene.enter('new-order')
})
