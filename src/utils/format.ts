import type { Patient } from '@/data/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** 10/20/2025 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

/** 2:39 PM */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours() % 12 || 12;
  return `${h}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
}

export function fullName(p: Pick<Patient, 'firstName' | 'lastName'>): string {
  return `${p.firstName} ${p.lastName}`;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Fri, Dec 14 at 2:39 PM */
export function formatDayHeader(iso: string): string {
  const d = new Date(iso);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} at ${formatTime(iso)}`;
}

export function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Monday 3/17 @ 8:00 AM */
export function formatAppointment(iso: string): string {
  const d = new Date(iso);
  return `${FULL_DAYS[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()} @ ${formatTime(iso)}`;
}

/** Fri Apr 12 @ 9:00 AM */
export function formatShortAppointment(iso: string): string {
  const d = new Date(iso);
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()} @ ${formatTime(iso)}`;
}

/** April 2026 */
export function formatMonth(d: Date): string {
  return `${FULL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
