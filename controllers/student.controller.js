
import StudentModel from '../models/student.model.js';

export default {
   getAllStudent: async (req, reply) => {
    await StudentModel.find_all(req.server, (err, data) => {
      if (err) {
        reply.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving students.',
        });
      } else {
        reply.send(data);
      }
    });
  },

  getStudentById: async (req, reply) => {
    await StudentModel.find_one(req.server, req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Student with id req.params.id.',
          });
        } else {
          reply.status(500).send({
            message: 'Error retrieving Student with id ' + req.params.id,
          });
        }
      } else {
        reply.send(data);
      }
    });
  },

  createStudent: async (req, reply) => {
    if (!req.body) {
      reply.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    await StudentModel.create(req.server, req.body, (err, data) => {
      if (err) {
        reply.status(500).send({
          message:
            err.message || 'Some error occurred while creating the student.',
        });
      } else {
        reply.send(data);
      }
    });

  },

  updateStudent: async (req, reply) => {
    if (!req.body) {
      reply.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    await StudentModel.update(req.server, req.params.id, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Student with id req.params.id.',
          });
        } else {
          reply.status(500).send({
            message: 'Error updating Student with id ' + req.params.id,
          });
        }
      } else {
        reply.send(data);
      }
    });

  },

   deleteStudent: async (req, reply) => {
    await StudentModel.delete(req.server, req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          reply.status(404).send({
            message: 'Not found Student with id req.params.id.',
          });
        } else {
          reply.status(500).send({
            message: 'Could not delete Student with id ' + req.params.id,
          });
        }
      } else {
        reply.send({ message: 'Deleted Student successfully!' });
      }
    });

  },
};
