import { Context } from 'telegraf'

export const handleOrders = async (ctx: Context) => {
  await ctx.answerCbQuery()
  await ctx.reply('📦 Пока у тебя нет заказов.')
}
