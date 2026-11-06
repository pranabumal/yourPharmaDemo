// Fake backend. Every call waits a little to feel like a network request.
// Swap these functions for real HTTP calls when a backend exists.
import { users } from '@/data/mock';
import type { Order, PickupMethod, User } from '@/data/types';

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

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

export type OrderRequest = {
  patientId: string;
  medicationIds: string[];
  pickup: PickupMethod;
  note?: string;
};

export async function submitOrder(req: OrderRequest): Promise<Order> {
  await wait(900);
  return { ...req, id: newId('o'), status: 'submitted', createdAt: new Date().toISOString() };
}

/** How long the fake pharmacy takes to fill an order. */
export const ORDER_READY_AFTER_MS = 15_000;
