import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeFetchNearbyService } from '@/services/factories/make-fetch-nearby-gums-service';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGymsService = makeFetchNearbyService();

  const { gyms } = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
}
