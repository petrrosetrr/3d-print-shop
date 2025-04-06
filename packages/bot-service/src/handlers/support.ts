import { Context } from 'telegraf'

export const handleSupport = async (ctx: Context) => {
  await ctx.answerCbQuery()
  await ctx.reply('📨 Напиши нам: @your_support_username')
}
