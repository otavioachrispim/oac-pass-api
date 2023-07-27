import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUsersMetricsService } from '@/services/factories/make-get-users-metrics-service';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userMetricsService = makeUsersMetricsService();

  const { checkInsCount } = await userMetricsService.execute({
    userId: request.user.sub,
  });

  return reply.status(201).send({
    checkInsCount,
  });
}
