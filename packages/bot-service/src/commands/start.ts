import { Context } from 'telegraf'

export const startCommand = async (ctx: Context) => {
  await ctx.reply('Привет! Что хочешь сделать?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📦 Мои заказы', callback_data: 'orders' }],
        [{ text: '🆕 Новый заказ', callback_data: 'new_order' }],
        [{ text: '🛟 Поддержка', callback_data: 'support' }],
      ],
    },
  })
}
