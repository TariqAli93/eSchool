import fastify from 'fastify'
import userRoute from './routes/user.routes.js'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

import { PrismaClient } from '@prisma/client'
import prismaErrorMiddleware from './middlewares/prismaErrorHandler.js'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

prisma.$use(prismaErrorMiddleware)

globalThis.prisma = prisma

dotenv.config()

// Define the logger configuration based on the environment

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

const app = fastify({
  logger: envToLogger[process.env.ENVIRONMENT] ?? true,
})

// Register the routes
app.register(userRoute)

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
})
const server = async () => {
  try {
    await app.listen({ port: process.env.SERVER_PORT || 5000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

server()
