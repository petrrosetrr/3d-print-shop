import { config } from 'dotenv'
config()

import Fastify from 'fastify'

import { adminRouter } from './admin.js'

const app = Fastify()

await adminRouter(app)

const PORT = process.env.PORT || 4000

app.get('/ping', async () => {
  return 'pong'
})

app.listen({ port: Number(PORT), host: '0.0.0.0' }).then(() => {
  console.log(`🚀 Admin panel running at http://localhost:${PORT}/admin`)
})
