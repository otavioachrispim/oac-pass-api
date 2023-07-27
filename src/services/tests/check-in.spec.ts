import { expect, it, describe, beforeEach, vi, afterAll } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInService } from '../checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins';
import { MaxDistanceError } from '../errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('Authenticate Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS Gym',
      latitude: -22.5122834,
      longitude: -44.086514,
      description: 'The best gym in the world',
      phone: '2424242424',
    });

    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.5122834,
      userLongitude: -44.086514,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2022, 0, 20, 8, 0, 0'));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.5122834,
      userLongitude: -44.086514,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.5122834,
        userLongitude: -44.086514,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2022, 0, 20, 8, 0, 0'));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.5122834,
      userLongitude: -44.086514,
    });

    vi.setSystemTime(new Date('2023, 0, 21, 8, 0, 0'));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.5122834,
      userLongitude: -44.086514,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distance gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Gym 02',
      description: '',
      latitude: new Decimal(-22.4863919),
      longitude: new Decimal(-44.0286055),
      phone: '',
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.534268,
        userLongitude: -44.224035,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
