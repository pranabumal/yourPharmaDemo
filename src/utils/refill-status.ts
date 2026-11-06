import type { Medication, Order } from '@/data/types';

import { formatDate } from './format';

export type RefillStatusKind = 'ordered' | 'ready' | 'past-due' | 'auto' | 'due' | 'none';

export type RefillStatus = { kind: RefillStatusKind; label: string };

/** The open (not yet picked up) order containing this medication, if any. */
export function openOrderFor(med: Medication, orders: Order[]): Order | undefined {
  return orders.find((o) => o.status !== 'picked-up' && o.medicationIds.includes(med.id));
}

export function refillStatus(med: Medication, orders: Order[], now = new Date()): RefillStatus {
  const open = openOrderFor(med, orders);
  if (open?.status === 'ready') return { kind: 'ready', label: 'Ready for pickup' };
  if (open) return { kind: 'ordered', label: `Refill requested: ${formatDate(open.createdAt)}` };
  if (!med.refillDue) return { kind: 'none', label: '' };
  if (med.autoRefill) return { kind: 'auto', label: `Auto-refill: ${formatDate(med.refillDue)}` };
  if (new Date(med.refillDue) < now) {
    return { kind: 'past-due', label: `Refill past due: ${formatDate(med.refillDue)}` };
  }
  return { kind: 'due', label: `Refill due: ${formatDate(med.refillDue)}` };
}

/** Whether a new refill can be ordered for this medication right now. */
export function canOrder(med: Medication, orders: Order[]): boolean {
  return !med.archived && !openOrderFor(med, orders);
}
