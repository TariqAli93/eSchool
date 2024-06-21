import { Prisma } from '@prisma/client'
import logger from '../logger.js'

const prismaErrorMiddleware = async (params, next) => {
  try {
    const result = await next(params)
    return result
  } catch (error) {
    logger.error('Prisma Error:', {
      model: params.model,
      action: params.action,
      args: params.args,
      error: error.message,
      code: error.code,
    })

    // Categorize and handle different types of Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Known Prisma errors (unique constraint violation, record not found, etc.)
      switch (error.code) {
        case 'P2002':
          throw createError({
            statusCode: 409,
            message: 'Unique constraint violation.',
            code: error.code,
          })
        case 'P2025':
          throw createError({
            statusCode: 404,
            message: 'Record not found.',
            code: error.code,
          })
        case 'P2003':
          throw createError({
            statusCode: 409,
            message: 'Foreign key constraint violation.',
            code: error.code,
          })
        // ... other known error codes ...
        default:
          throw createError({
            statusCode: 500,
            message: `Prisma error: ${error.code}`,
            code: error.code,
          })
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Validation errors (invalid data types, missing required fields)
      throw createError({
        statusCode: 400,
        message: 'Invalid data provided.',
      })
    } else {
      // Unknown errors
      const errorMessage =
        process.env.ENVIRONMENT === 'production'
          ? 'An unexpected database error occurred.'
          : error.message
      throw createError({
        statusCode: 500,
        message: errorMessage,
      })
    }
  }
}

function createError({ statusCode = 500, message, code }) {
  const error = new Error(message)
  error.statusCode = statusCode
  if (code) error.code = code
  return error
}

export default prismaErrorMiddleware
