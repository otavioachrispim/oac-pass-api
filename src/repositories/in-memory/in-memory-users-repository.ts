import { GetResult } from '@prisma/client/runtime/library';
import { UsersRepository } from '../users-repository';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      role: data.role ?? 'MEMBER',
    };

    this.items.push(user);

    return user;
  }
}
