import { expect, it, describe, beforeEach, vi, afterAll } from 'vitest';
import { SearchGymsService } from '../search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('Search Gym Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: -22.5122834,
      longitude: -44.086514,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: -22.5122834,
      longitude: -44.086514,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        latitude: -22.5122834,
        longitude: -44.086514,
        description: 'The best gym in the world',
        phone: '2424242424',
      });
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});
