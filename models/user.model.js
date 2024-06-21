const Users = function (Users) {}

Users.getAll = async (result) => {
  try {
    const users = await globalThis.prisma.user.findMany()
    result(null, users)
  } catch (error) {
    result(error, null)
  }
}

Users.getById = async (id, result) => {}

Users.create = async (newUser, result) => {}

Users.updateById = async (id, user, result) => {}

Users.remove = async (id, result) => {}

Users.removeAll = async (result) => {}

export default Users
