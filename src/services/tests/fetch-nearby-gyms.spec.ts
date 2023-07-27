import { expect, it, describe, beforeEach, vi, afterAll } from 'vitest';
import { SearchGymsService } from '../search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsService } from '../fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe('Fetch Nearby Gym Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -22.5122834,
      longitude: -44.086514,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -22.8422826,
      longitude: -43.4021758,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.5122834,
      userLongitude: -44.086514,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
