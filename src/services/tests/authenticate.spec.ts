import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from '../authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from '../errors/invalid-credential-erro';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com.br',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'john.doe@gmail.com.br',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'john.doe@gmail.com.br',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com.br',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'john.doe@gmail.com.br',
        password: '123436',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
