import Fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config()

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

app
  .listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' })
  .then(() => console.log('🚀 Server running'))
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
