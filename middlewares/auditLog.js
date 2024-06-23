// middleware.js (or .ts if using TypeScript)
import { Prisma } from '@prisma/client'

export const auditLogMiddleware = async (params, next) => {
  const result = await next(params)

  const userId =
    params.args.data?.userId || // For create/update
    params.args.where?.userId || // For delete/findUnique
    'SYSTEM' // If no user is involved (e.g., system tasks)

  // await prisma.auditLog.create({
  //   data: {
  //     userId,
  //     action: params.action,
  //     entity: params.model,
  //     entityId: result.id, // Assuming the operation returned a record with an ID
  //   },
  // })

  console.log(params.where)

  return result
}
