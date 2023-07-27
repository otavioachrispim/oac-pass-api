import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeFetchUserCheckInHistoryService } from './../../../services/factories/make-fetch-user-check-in-history-service';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkinHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkinHistoryQuerySchema.parse(request.query);

  const fetchUserCheckinHistoryService = makeFetchUserCheckInHistoryService();

  const { checkIns } = await fetchUserCheckinHistoryService.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(201).send({
    checkIns,
  });
}
