// Fake backend. Every call waits a little to feel like a network request.
// Swap these functions for real HTTP calls when a backend exists.
import { users } from '@/data/mock';
import type { User } from '@/data/types';

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

function toPublicUser({ password: _password, ...user }: (typeof users)[number]): User {
  return user;
}

export async function login(email: string, password: string): Promise<User> {
  await wait();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!match) throw new Error('Incorrect email or password.');
  return toPublicUser(match);
}

export async function getUser(id: string): Promise<User | null> {
  const match = users.find((u) => u.id === id);
  return match ? toPublicUser(match) : null;
}
