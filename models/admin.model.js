export default {
  find_all: async (app, callback) => {
    try {
      const admins = await app.prisma.user.findMany({
        where: {
          role: 'ADMIN',
        },

        include: {
          profile: true,
        },
      })

      callback(null, admins)
    } catch (error) {
      callback(error, null)
    }
  },

  find_one: async (app, id, callback) => {
    try {
      const admin = await app.prisma.user.findUnique({
        where: {
          id: id,
          role: 'ADMIN',
        },

        include: {
          profile: true,
        },
      })

      if (admin) {
        callback(null, admin)
      } else {
        callback({ kind: 'not_found' }, null)
      }
    } catch (error) {
      callback(error, null)
    }
  },

  create: async (app, data, callback) => {
    try {
      const admin = await app.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          role: 'ADMIN',
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              birthDate: data.birthDate,
            },
          },
        },

        include: {
          profile: true,
        },
      })

      callback(null, admin)
    } catch (error) {
      callback(error, null)
    }
  },

  update: async (app, id, data, callback) => {
    try {
      const admin = await app.prisma.user.update({
        where: {
          id: id,
          role: 'ADMIN',
        },
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          profile: {
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
              birthDate: data.birthDate,
            },
          },
        },

        include: {
          profile: true,
        },
      })

      callback(null, admin)
    } catch (error) {
      callback(error, null)
    }
  },

  delete: async (app, id, callback) => {
    try {
      const admin = await app.prisma.user.delete({
        where: {
          id: id,
          role: 'ADMIN',
        },

        include: {
          profile: true,
        },
      })

      await prisma.profile.delete({
        where: {
          id: admin.profile.id,
        },
      })

      callback(null, admin)
    } catch (error) {
      callback(error, null)
    }
  },

  adminLogin: async (app, email, callback) => {
    try {
      const admin = await app.prisma.user.findFirst({
        where: {
          email: email,
          role: 'ADMIN',
        },

        include: {
          profile: true,
        },
      })

      if (admin) callback(null, admin)
      else callback({ kind: 'not_found' }, null)
    } catch (error) {
      callback(error, null)
    }
  },
}
