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
