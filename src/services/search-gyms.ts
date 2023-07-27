import { Gym } from '@prisma/client';
import { GymRepository } from '@/repositories/gyms-repository';

interface SearchGymsServiceProps {
  query: string;
  page: number;
}

interface SearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private gymsRepository: GymRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsServiceProps): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
