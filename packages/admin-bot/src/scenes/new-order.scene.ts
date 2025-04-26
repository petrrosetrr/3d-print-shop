import { Markup, Scenes } from 'telegraf'

export const newOrderScene = new Scenes.WizardScene<Scenes.WizardContext>(
  'new-order',

  // Шаг 1 — загрузка модели
  async (ctx) => {
    await ctx.reply('📤 Пожалуйста, загрузите 3D модель (.stl, .3mf, .obj)')
    return ctx.wizard.next()
  },

  // Шаг 2 — выбор материала
  async (ctx) => {
    if (ctx.message && 'document' in ctx.message) {
      ;(ctx.wizard.state as any).file = ctx.message.document

      await ctx.reply(
        '🧵 Выберите материал:',
        Markup.inlineKeyboard([
          [Markup.button.callback('PLA', 'mat_pla')],
          [Markup.button.callback('ABS', 'mat_abs')],
        ])
      )
    } else {
      await ctx.reply('❗ Пожалуйста, отправьте файл модели.')
      return
    }

    return ctx.wizard.next()
  },

  // Шаг 3 — сохранить материал и завершить
  async (ctx) => {
    if (!ctx.callbackQuery) return

    const material = (ctx.callbackQuery as any)?.data.replace('mat_', '')
    ;(ctx.wizard.state as any).material = material

    await ctx.reply(`✅ Модель получена.\nМатериал: ${material.toUpperCase()}`)
    await ctx.scene.leave()
  }
)
