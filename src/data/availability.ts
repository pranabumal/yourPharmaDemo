// Fake appointment availability. Slots are generated from the date and service,
// so the same day always shows the same free times.
import type { Appointment, Service } from './types';

const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const SLOT_STEP_MIN = 30;
const BOOKING_WINDOW_DAYS = 60;

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Free start times (ISO strings) for a service on one day. */
export function slotsFor(service: Service, day: Date, booked: Appointment[]): string[] {
  if (!service.available) return [];
  const today = startOfDay(new Date());
  const start = startOfDay(day);
  const daysAhead = (start.getTime() - today.getTime()) / 86_400_000;
  if (daysAhead < 0 || daysAhead > BOOKING_WINDOW_DAYS) return [];
  if (start.getDay() === 0) return []; // closed Sundays
  if (hash(service.id + start.toDateString()) % 4 === 0) return []; // fully booked day

  const taken = new Set(booked.filter((a) => !a.cancelled).map((a) => a.at));
  const now = Date.now();
  const slots: string[] = [];
  for (let min = OPEN_HOUR * 60; min + service.durationMin <= CLOSE_HOUR * 60; min += SLOT_STEP_MIN) {
    const slot = new Date(start);
    slot.setMinutes(min);
    const iso = slot.toISOString();
    if (slot.getTime() <= now || taken.has(iso)) continue;
    if (hash(service.id + iso) % 3 === 0) continue; // someone else booked it
    slots.push(iso);
  }
  return slots;
}

/** The earliest free slot for a service, if any. */
export function nextAvailable(service: Service, booked: Appointment[]): string | undefined {
  const day = startOfDay(new Date());
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    const slots = slotsFor(service, day, booked);
    if (slots.length) return slots[0];
    day.setDate(day.getDate() + 1);
  }
  return undefined;
}
