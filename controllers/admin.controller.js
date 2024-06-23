import AdminModel from '../models/admin.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default {
  getAllAdmin: async (req, reply) => {
    await AdminModel.find_all(req.server, (err, data) => {
      if (err) {
        reply.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving admins.',
        })
      } else {
        const admin = data.map((item) => {
          return {
            adminId: item.id,
            email: item.email,
            status: item.status,
            createdAt: item.createdAt.toISOString().split('T')[0],
            updatedAt: item.updatedAt.toISOString().split('T')[0],
            profile: {
              profileId: item.profile.id,
              firstName: item.profile.firstName,
              lastName: item.profile.lastName,
              phoneNumber: item.profile.phoneNumber,
              avatarUrl: item.profile.avatarUrl,
              birthDate: item.profile.birthDate.toISOString().split('T')[0],
            },
          }
        })
        return reply.send(admin)
      }
    })
  },

  getAdminById: async (req, reply) => {
    await AdminModel.find_one(req.server, req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: `Not found Admin with id ${req.params.id}.`,
          })
        } else {
          reply.status(500).send({
            message: 'Error retrieving Admin with id ' + req.params.id,
          })
        }
      } else {
        const admin = {
          adminId: data.id,
          email: data.email,
          status: data.status,
          createdAt: data.createdAt.toISOString().split('T')[0],
          updatedAt: data.updatedAt.toISOString().split('T')[0],
          profile: {
            profileId: data.profile.id,
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            phoneNumber: data.profile.phoneNumber,
            avatarUrl: data.profile.avatarUrl,
            birthDate: data.profile.birthDate.toISOString().split('T')[0],
          },
        }
        reply.send(admin)
      }
    })
  },

  createAdmin: async (req, reply) => {
    if (!req.body) {
      reply.status(400).send({
        message: 'Content can not be empty!',
      })
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10)
    const passwordHashed = bcrypt.hashSync(req.body.passwordHash, salt)

    const admin = {
      email: req.body.email,
      passwordHash: passwordHashed,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      phoneNumber: req.body.phone,
      birthDate: req.body.birth_date,
    }

    await AdminModel.create(req.server, admin, (err, data) => {
      if (err) {
        reply.status(500).send({
          message:
            err.message || 'Some error occurred while creating the admin.',
        })
      } else {
        reply.send(data)
      }
    })
  },

  updateAdmin: async (req, reply) => {
    if (!req.body) {
      reply.status(400).send({
        message: 'Content can not be empty!',
      })
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10)
    const passwordHashed = bcrypt.hashSync(req.body.passwordHash, salt)

    const admin = {
      email: req.body.email,
      passwordHash: passwordHashed,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      phoneNumber: req.body.phone,
      birthDate: req.body.birth_date,
    }

    await AdminModel.update(req.server, req.params.id, admin, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Admin with id req.params.id.',
          })
        } else {
          reply.status(500).send({
            message: 'Error updating Admin with id ' + req.params.id,
          })
        }
      } else {
        reply.send(data)
      }
    })
  },

  deleteAdmin: async (req, reply) => {
    await AdminModel.delete(req.server, req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Admin with id req.params.id.',
          })
        } else {
          reply.status(500).send({
            message: 'Could not delete Admin with id ' + req.params.id,
          })
        }
      } else {
        reply.send({ message: 'Deleted Admin successfully!' })
      }
    })
  },

  login: async (req, reply) => {
    await AdminModel.adminLogin(req.server, req.body.email, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Admin with email ' + req.body.email,
          })
        } else {
          console.log(err)
          reply.status(500).send({
            message: 'Email address not found.',
          })
        }
      } else {
        const passwordIsValid = bcrypt.compareSync(
          req.body.passwordHash,
          data.passwordHash,
        )
        if (!passwordIsValid) {
          reply.status(401).send({
            accessToken: null,
            message: 'Email or password is incorrect.',
          })
        }

        const token = jwt.sign(
          {
            id: data.id,
            role: data.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: 86400, // 24 hours
          },
        )

        reply.send({
          id: data.id,
          email: data.email,
          role: data.role,
          profile: {
            id: data.profile.id,
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            phoneNumber: data.profile.phoneNumber,
            avatarUrl: data.profile.avatarUrl,
            birthDate: data.profile.birthDate.toISOString().split('T')[0],
          },
          accessToken: token,
        })
      }
    })
  },
}
