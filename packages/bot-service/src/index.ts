import { config } from 'dotenv'
import Fastify from 'fastify'

config({})
config({ path: './.env.local', override: true })

const bot = require('./bot').bot
const app = Fastify()
const port = Number(process.env.PORT || 3000)
const path = process.env.WEBHOOK_PATH || '/bot'

app.post(path, async (request, reply) => {
  try {
    await bot.handleUpdate(request.body as any)
  } catch (err) {
    console.error('Error handling update:', err)
  }
  reply.send({ ok: true })
})

app.get('/ping', async () => {
  return 'pong'
})

async function start() {
  const domain = process.env.WEBHOOK_DOMAIN!
  const webhookUrl = `${domain}${path}`

  await bot.telegram.setWebhook(webhookUrl)
  console.log(`✅ Webhook set to: ${webhookUrl}`)

  await app.listen({ port, host: '0.0.0.0' })
  console.log(`🚀 Fastify server running at http://localhost:${port}`)
}

start()
