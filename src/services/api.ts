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

/** How long the fake pharmacy takes to answer a message. */
export const REPLY_AFTER_MS = 2_500;

export const PHARMACY_STAFF = 'Robert M., Tech';

const CANNED_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /\b(open|close|hours?|tonight|today)\b/i,
    reply: "We're open until 10 PM on weekdays and 6 PM on weekends.",
  },
  {
    match: /\b(refill|ready|pick ?up|order)\b/i,
    reply: "Let me check on that for you. You'll get a message here as soon as your order is ready.",
  },
  {
    match: /\b(appointment|vaccin\w*|shot|book)\b/i,
    reply: 'You can book or change appointments from the Appointments tab. Happy to help if you need anything else!',
  },
  {
    match: /\b(food|take|dose|side effects?|interact\w*)\b/i,
    reply: 'Good question! A pharmacist will review your medication and reply within the hour.',
  },
  {
    match: /\b(insurance|card|price|cost|pay\w*)\b/i,
    reply: "Thanks! We'll review your insurance details and let you know if anything changes.",
  },
];

/** Fake pharmacist answer, picked by keywords in the patient's message. */
export function pharmacyReply(text: string, hasImage: boolean): string {
  const canned = CANNED_REPLIES.find((c) => c.match.test(text));
  if (canned) return canned.reply;
  if (hasImage) return "Thanks, we received your photo. We'll take a look and get back to you.";
  return 'Thanks for your message! A member of our team will get back to you shortly.';
}

/** Pretends to re-fetch data from the pharmacy (used by pull-to-refresh). */
export async function refresh(): Promise<void> {
  await wait(800);
}
