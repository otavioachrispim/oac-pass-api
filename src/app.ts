import fastify from 'fastify';
import { usersRoutes } from './http/controllers/users/routes';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { gymRoutes } from './http/controllers/gyms/routes';
import { checkinRoutes } from './http/controllers/checkins/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
});

app.register(usersRoutes);
app.register(gymRoutes);
app.register(checkinRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    //to do log external - Datadog/Sentry/Loggly
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
