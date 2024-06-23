
import studentController from '../controllers/student.controller.js';

const studentRoutes = async (fastify, opts) => {
  fastify.get('/api/v1/students', studentController.getAllStudent);
  fastify.get('/api/v1/students/:id', studentController.getStudentById);
  fastify.post('/api/v1/students', studentController.createStudent);
  fastify.put('/api/v1/students/:id', studentController.updateStudent);
  fastify.delete('/api/v1/students/:id', studentController.deleteStudent);
};

export default studentRoutes;
