import AdminJSFastify from '@adminjs/fastify'
import AdminJS from 'adminjs'
import pkg from 'pg'
const { Client } = pkg

export async function adminRouter(app: any) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })
  await client.connect()

  const admin = new AdminJS({
    rootPath: '/admin',
    resources: [], // TODO: Add Drizzle models here
    branding: {
      companyName: '3D Print Shop',
    },
  })

  await AdminJSFastify.buildRouter(admin, app)
}
