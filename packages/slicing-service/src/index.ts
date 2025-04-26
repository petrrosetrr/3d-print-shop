import Fastify from 'fastify'
import cors from 'fastify-cors'
import multipart from 'fastify-multipart'
import { z } from 'zod'
import { S3Client } from '@aws-sdk/client-s3'
import { SliceService } from './services/slice.service.js'
import { ModelAnalyzer } from './services/model-analyzer.service.js'
import { GrpcServer } from './grpc/server.js'
import { config } from './config.js'

// Initialize HTTP server
const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

// Register plugins
app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
app.register(multipart, {
  limits: {
    fileSize: config.maxFileSize,
  },
})

// Initialize services
const s3Client = new S3Client({
  region: config.awsRegion,
})
const sliceService = new SliceService()
const modelAnalyzer = new ModelAnalyzer()

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok' }
})

// Upload and analyze model
app.post('/analyze', async (request, reply) => {
  const data = await request.file()
  if (!data) {
    return reply.status(400).send({ error: 'No file uploaded' })
  }

  try {
    const analysis = await modelAnalyzer.analyzeModel(data.file)
    return analysis
  } catch (error) {
    app.log.error(error)
    return reply.status(500).send({ error: 'Failed to analyze model' })
  }
})

// Slice model with specific profile
app.post('/slice', async (request, reply) => {
  const sliceRequestSchema = z.object({
    modelUrl: z.string().url(),
    profile: z.string(),
    options: z.record(z.any()).optional(),
  })

  try {
    const { modelUrl, profile, options } = sliceRequestSchema.parse(request.body)
    const result = await sliceService.sliceModel(modelUrl, profile, options)
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Invalid request format', details: error.errors })
    }
    app.log.error(error)
    return reply.status(500).send({ error: 'Failed to slice model' })
  }
})

// Start servers
const start = async () => {
  try {
    // Start gRPC server
    const grpcServer = new GrpcServer()
    grpcServer.start()

    // Start HTTP server
    await app.listen({ port: config.port, host: '0.0.0.0' })
    console.log(`HTTP server is running on http://localhost:${config.port}`)
    console.log(`gRPC server is running on port ${config.grpcPort}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
