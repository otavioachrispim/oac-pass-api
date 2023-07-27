import { makeCheckInService } from '@/services/factories/make-check-in-service';
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const valdiateCheckinParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = valdiateCheckinParamsSchema.parse(request.params);

  const validateCheckinService = makeValidateCheckInService();

  await validateCheckinService.execute({
    checkInId,
  });

  return reply.status(204).send();
}
