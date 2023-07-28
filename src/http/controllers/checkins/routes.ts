import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { create } from './create';
import { validate } from './validate';
import { history } from './history';
import { metrics } from './metrics';
import { verifyUserRole } from '@/http/middlewares/refiry-user-role';

export async function checkinRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/checkins/history', history);
  app.get('/checkins/metrics', metrics);

  app.post('/gyms/:gym/checkins', create);
  app.patch(
    '/checkins/:checkinId/validade',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    validate
  );
}
