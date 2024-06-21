import UserModel from '../models/user.model.js'

// Get all users
export const getAllUsers = (req, res) => {
  UserModel.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      })
    } else {
      if (data.length > 0) {
        res.send(data)
      } else {
        res.status(404).send({ message: 'No user found' })
      }
    }
  })
}

// Get a single user
export const getUsersById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await UserModel.getById(id)
    if (!user) {
      res.status(404).send({ message: 'Not found' })
    } else {
      res.send(user)
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while retrieving user.',
    })
  }
}

// Create a new user
export const createUsers = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }

  try {
    const newUser = await UserModel.create(req.body)
    res.send(newUser)
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the user.',
    })
  }
}

// Update an existing user
export const updateUsers = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }

  try {
    const { id } = req.params
    const updatedUser = await UserModel.updateById(id, req.body)
    if (!updatedUser) {
      res.status(404).send({ message: 'Not found' })
    } else {
      res.send(updatedUser)
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while updating the user.',
    })
  }
}

// Delete a user
export const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await UserModel.remove(id)
    if (!deletedUser) {
      res.status(404).send({ message: 'Not found' })
    } else {
      res.send({ message: 'Deleted' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while deleting the user.',
    })
  }
}

// delete all user
export const deleteAllUsers = async (req, res) => {
  /* ... (Implementation) ... */
}
