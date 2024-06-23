import adminController from '../controllers/admin.controller.js'
import checkAdmin from '../middlewares/checkAdmin.js'

const adminRoutes = async (fastify, opts) => {
  fastify.get(
    '/api/v1/admins',
    { preHandler: checkAdmin },
    adminController.getAllAdmin,
  )
  fastify.get(
    '/api/v1/admins/:id',
    { preHandler: checkAdmin },
    adminController.getAdminById,
  )
  fastify.post(
    '/api/v1/admins',
    { preHandler: checkAdmin },
    adminController.createAdmin,
  )
  fastify.put(
    '/api/v1/admins/:id',
    { preHandler: checkAdmin },
    adminController.updateAdmin,
  )
  fastify.delete(
    '/api/v1/admins/:id',
    { preHandler: checkAdmin },
    adminController.deleteAdmin,
  )

  fastify.post('/api/v1/admins/login', adminController.login)
}

export default adminRoutes
