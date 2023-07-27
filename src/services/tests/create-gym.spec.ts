import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymService } from '../create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('Register Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it('shouldbe able to register', async () => {
    const { gym } = await sut.execute({
      title: 'JS Gym',
      latitude: -22.5122834,
      longitude: -44.086514,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
