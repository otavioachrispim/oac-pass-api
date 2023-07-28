import { FastifyInstance } from 'fastify';
import { register } from './register';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { refresh } from './refresh';
import { verifyUserRole } from '@/http/middlewares/refiry-user-role';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /**Authenticated */
  app.get('/me', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, profile);
}
