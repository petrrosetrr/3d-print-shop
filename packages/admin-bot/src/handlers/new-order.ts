import { Context } from 'telegraf'

export const handleNewOrder = async (ctx: Context) => {
  await ctx.answerCbQuery()
  await ctx.reply('🛠 Функция оформления заказа скоро появится!')
}
