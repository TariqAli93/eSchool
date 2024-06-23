export default {
  find_all: async (app, callback) => {
    try {
      const students = await app.prisma.user.findMany({
        where: {
          role: 'STUDENT',
        },

        include: {
          profile: true,
        },
      })

      callback(null, students)
    } catch (error) {
      callback(error, null)
    }
  },
  find_one: async (app, id, callback) => {
    // Prisma Query
  },
  create: async (app, data, callback) => {
    // Prisma Query
  },
  update: async (app, id, data, callback) => {
    // Prisma Query
  },
  delete: async (app, id, callback) => {
    // Prisma Query
  },
}
