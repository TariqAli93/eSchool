import {
  getAllUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
} from '../controllers/user.controller.js'

const userRoutes = async (app, options) => {
  app.get('/users', await getAllUsers)
  app.get('/users/:id', await getUsersById)
  app.post('/users', await createUsers)
  app.put('/users/:id', await updateUsers)
  app.delete('/users/:id', await deleteUsers)
}

export default userRoutes
