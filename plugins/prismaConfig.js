import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import prismaErrorMiddleware from '../middlewares/prismaErrorHandler.js'

async function prismaInstancePlugin(fastify, options) {
  const prisma = new PrismaClient({
    log:
      process.env.ENVIRONMENT !== 'production'
        ? ['query', 'error', 'warn', 'info']
        : ['warn', 'error'],
    errorFormat: 'pretty',
  })

  prisma.$use(prismaErrorMiddleware)

  fastify.decorate('prisma', prisma)
}

export default fp(prismaInstancePlugin)
