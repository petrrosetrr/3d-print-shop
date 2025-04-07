import AdminJSFastify from '@adminjs/fastify'
import { Database, Resource } from '@adminjs/sql'
import AdminJS from 'adminjs'
import pg from 'pg'

AdminJS.registerAdapter({ Database, Resource })

export async function adminRouter(app: any) {
  const admin = new AdminJS({
    rootPath: '/',
    databases: [
      {
        client: new pg.Client({
          connectionString: process.env.DATABASE_URL!,
        }),
        name: 'Postgres',
      },
    ],
    branding: {
      companyName: '3D Print Shop',
    },
  })

  await AdminJSFastify.buildRouter(admin, app)
}
