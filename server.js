import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

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
  production: false,
  test: false,
}

const app = fastify({
  logger: envToLogger[process.env.ENVIRONMENT] ?? true,
})

await app.register(autoLoad, {
  dir: join(__dirname, 'routes'),
  dirNameRoutePrefix: false,
  routeParams: true,
})

await app.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
  dirNameRoutePrefix: false,
  routeParams: true,
})

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
