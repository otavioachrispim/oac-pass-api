import { FecthUserCheckInsService } from '../fetch-user-check-ins-history';
import { GetUserMetricsService } from '../get-user-metrics';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUserCheckInHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const service = new FecthUserCheckInsService(checkInsRepository);

  return service;
}
