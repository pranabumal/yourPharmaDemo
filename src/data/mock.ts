import type {
  Appointment,
  Caregiver,
  FormSubmission,
  Medication,
  Order,
  Patient,
  Pharmacy,
  Service,
  Thread,
  User,
} from './types';

// Dates are relative to today so the demo always looks current
// (e.g. one refill is always past due).
function daysFromNow(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const DEMO_CREDENTIALS = { email: 'chris@demo.com', password: 'demo123' };

export const pharmacy: Pharmacy = {
  id: 'ph-1',
  name: 'Your Pharmacy',
  branch: 'S. Lamar',
  address1: '1564 S. Lamar Blvd, Suite 300',
  address2: 'Austin, TX 78704',
  phone: '(512) 456-1234',
  hours: 'Mon–Fri 8 AM – 10 PM · Sat–Sun 9 AM – 6 PM',
  coords: { latitude: 30.2509, longitude: -97.7666 },
};

export const patients: Patient[] = [
  { id: 'p-chris', firstName: 'Chris', lastName: 'Paterson', dob: '1982-03-11', relation: 'self' },
  { id: 'p-jake', firstName: 'Jake', lastName: 'Paterson', dob: '2015-05-17', relation: 'child' },
  { id: 'p-arlene', firstName: 'Arlene', lastName: 'Paterson', dob: '1953-07-24', relation: 'adult' },
];

export const users: (User & { password: string })[] = [
  {
    id: 'u-chris',
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    patientId: 'p-chris',
    role: 'Caregiver',
  },
];

export const medications: Medication[] = [
  {
    id: 'm-1',
    patientId: 'p-chris',
    name: 'Atorvastatin 20mg tablet',
    rxNumber: '1234567890',
    enteredManually: true,
    lastFilled: daysFromNow(-40),
    refillDue: daysFromNow(-10),
    instructions: 'Take 1 tablet by mouth once daily in the evening.',
  },
  {
    id: 'm-2',
    patientId: 'p-chris',
    name: 'Metformin HCL 500mg tablet',
    rxNumber: '1234567891',
    lastFilled: daysFromNow(-17),
    refillDue: daysFromNow(13),
    instructions: 'Take 1 tablet by mouth twice daily with meals.',
  },
  {
    id: 'm-3',
    patientId: 'p-chris',
    name: 'Tradjenta 5mg tablet',
    rxNumber: '1234567892',
    lastFilled: daysFromNow(-16),
    refillDue: daysFromNow(14),
    autoRefill: true,
    instructions: 'Take 1 tablet by mouth once daily.',
  },
  {
    id: 'm-4',
    patientId: 'p-chris',
    name: 'Amoxicillin 500mg capsule',
    rxNumber: '1234567893',
    lastFilled: daysFromNow(-120),
    archived: true,
    instructions: 'Take 1 capsule by mouth every 8 hours until finished.',
  },
  {
    id: 'm-5',
    patientId: 'p-jake',
    name: 'Atorvastatin 20mg tablet',
    rxNumber: '2234567890',
    lastFilled: daysFromNow(-45),
    refillDue: daysFromNow(-15),
    instructions: 'Take 1 tablet by mouth once daily.',
  },
  {
    id: 'm-6',
    patientId: 'p-jake',
    name: 'Metformin HCL 500mg tablet',
    rxNumber: '2234567891',
    lastFilled: daysFromNow(-10),
    refillDue: daysFromNow(20),
    instructions: 'Take 1 tablet by mouth twice daily with meals.',
  },
  {
    id: 'm-7',
    patientId: 'p-arlene',
    name: 'Lisinopril 10mg tablet',
    rxNumber: '3234567890',
    lastFilled: daysFromNow(-25),
    refillDue: daysFromNow(5),
    instructions: 'Take 1 tablet by mouth once daily.',
  },
];

export const orders: Order[] = [
  {
    id: 'o-1',
    patientId: 'p-chris',
    medicationIds: ['m-2'],
    status: 'picked-up',
    pickup: 'store',
    createdAt: daysFromNow(-17),
  },
  {
    id: 'o-2',
    patientId: 'p-chris',
    medicationIds: ['m-3'],
    status: 'ready',
    pickup: 'store',
    createdAt: daysFromNow(-1),
  },
];

const pharmacist = 'Robert M., Tech';

export const threads: Thread[] = [
  {
    id: 't-1',
    patientId: 'p-chris',
    topic: 'refill',
    subject: 'Your recent refill order is ready for pickup',
    unread: true,
    messages: [
      {
        id: 'msg-1',
        fromMe: false,
        author: pharmacist,
        text: 'Hi Chris, your Tradjenta refill is ready for pickup at S. Lamar.',
        at: daysFromNow(0, 8, 15),
      },
    ],
  },
  {
    id: 't-2',
    patientId: 'p-chris',
    topic: 'appointment',
    subject: 'Please confirm your upcoming appointment',
    unread: false,
    messages: [
      {
        id: 'msg-2',
        fromMe: false,
        author: pharmacist,
        text: 'Please confirm your COVID-19 vaccination appointment.',
        at: daysFromNow(-1, 10),
      },
    ],
  },
  {
    id: 't-3',
    patientId: 'p-chris',
    topic: 'question',
    subject: 'What time are you open til tonight?',
    unread: false,
    messages: [
      { id: 'msg-3', fromMe: true, author: 'Chris P., Caregiver', text: 'What time are you open til tonight?', at: daysFromNow(-2, 14, 39) },
      { id: 'msg-4', fromMe: false, author: pharmacist, text: "Hi, Chris! We'll be here until 10 pm.", at: daysFromNow(-2, 14, 40) },
      { id: 'msg-5', fromMe: true, author: 'Chris P., Caregiver', text: 'Great, thank you.', at: daysFromNow(-2, 14, 41) },
    ],
  },
  {
    id: 't-4',
    patientId: 'p-jake',
    topic: 'refill',
    subject: 'Your recent refill order is ready for pickup',
    unread: true,
    messages: [
      { id: 'msg-6', fromMe: false, author: pharmacist, text: "Jake's Metformin refill is ready.", at: daysFromNow(-1, 9) },
    ],
  },
  {
    id: 't-5',
    patientId: 'p-arlene',
    topic: 'prescription',
    subject: 'Information on your new prescription',
    unread: false,
    messages: [
      { id: 'msg-7', fromMe: false, author: pharmacist, text: 'Lisinopril is best taken at the same time each day.', at: daysFromNow(-3, 11) },
    ],
  },
];

export const services: Service[] = [
  {
    id: 's-covid',
    name: 'Covid-19 vaccination',
    description:
      'Getting vaccinated and boosted is the best way to protect yourself from COVID-19. It greatly reduces your risk of illness, hospitalization, and death.',
    durationMin: 30,
    icon: 'needle',
    available: true,
  },
  {
    id: 's-flu',
    name: 'Flu shot',
    description: 'Annual flu vaccine for adults and children 6 months and older.',
    durationMin: 15,
    icon: 'shield-plus-outline',
    available: true,
  },
  {
    id: 's-consult',
    name: 'General consultation',
    description: 'Talk with a pharmacist about your medications, side effects, or general health questions.',
    durationMin: 20,
    icon: 'doctor',
    available: false,
  },
];

export const appointments: Appointment[] = [
  { id: 'a-1', patientId: 'p-chris', serviceId: 's-covid', at: daysFromNow(4, 8), checklistComplete: true },
  { id: 'a-2', patientId: 'p-jake', serviceId: 's-flu', at: daysFromNow(9, 15, 30), checklistComplete: false },
  { id: 'a-3', patientId: 'p-chris', serviceId: 's-flu', at: daysFromNow(-60, 11), checklistComplete: true },
];

export const formSubmissions: FormSubmission[] = [
  { id: 'f-1', patientId: 'p-jake', name: 'Vaccine consent form', submittedAt: daysFromNow(-5) },
  { id: 'f-2', patientId: 'p-chris', name: 'Patient intake form', submittedAt: daysFromNow(-90) },
];

export const caregivers: Caregiver[] = [
  { id: 'c-1', name: 'Jennifer Smith', email: 'jensmith@gmail.com', status: 'authorized', date: daysFromNow(-380) },
  { id: 'c-2', name: 'John Smith', email: 'jsmith@gmail.com', status: 'pending', date: daysFromNow(-2) },
];
