import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Checkin (e2)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a checkin', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        latitude: -22.5122834,
        longitude: -44.086514,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.5122834,
        longitude: -44.086514,
      });

    expect(response.statusCode).toEqual(201);
  });
});
