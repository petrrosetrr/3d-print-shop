import AdminJSFastify from '@adminjs/fastify'
import { Database, Resource } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import AdminJS from 'adminjs'
import pg from 'pg'

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Resource, Database })

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
    resources: [
      { resource: { model: prisma.order, client: prisma } },
      { resource: { model: prisma.user, client: prisma } },
      { resource: { model: prisma.material, client: prisma } },
    ],
    branding: {
      companyName: '3D Print Shop',
    },
  })

  await AdminJSFastify.buildRouter(admin, app)
}
