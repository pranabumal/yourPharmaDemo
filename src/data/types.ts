export type Pharmacy = {
  id: string;
  name: string;
  branch: string;
  address1: string;
  address2: string;
  phone: string;
  hours: string;
  coords: { latitude: number; longitude: number };
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date
  relation: 'self' | 'child' | 'adult';
};

export type User = {
  id: string;
  email: string;
  patientId: string; // the user's own patient record
  role: string; // shown on chat messages, e.g. "Caregiver"
};

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  rxNumber: string;
  enteredManually?: boolean;
  lastFilled: string;
  refillDue?: string;
  autoRefill?: boolean;
  archived?: boolean;
  instructions: string;
};

export type OrderStatus = 'submitted' | 'ready' | 'picked-up';

export type PickupMethod = 'store' | 'delivery';

export type Order = {
  id: string;
  patientId: string;
  medicationIds: string[];
  status: OrderStatus;
  createdAt: string;
  pickup: PickupMethod;
  note?: string;
};

export type Message = {
  id: string;
  fromMe: boolean;
  author: string;
  text: string;
  at: string;
};

export type ThreadTopic = 'refill' | 'appointment' | 'prescription' | 'question';

export type Thread = {
  id: string;
  patientId: string;
  topic: ThreadTopic;
  subject: string;
  unread: boolean;
  messages: Message[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  icon: string; // MaterialCommunityIcons name
  available: boolean;
};

export type Appointment = {
  id: string;
  patientId: string;
  serviceId: string;
  at: string;
  checklistComplete: boolean;
};

export type Caregiver = {
  id: string;
  name: string;
  email: string;
  status: 'authorized' | 'pending';
  date: string;
};

export type FormSubmission = {
  id: string;
  patientId: string;
  name: string;
  submittedAt: string;
};
