import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import * as mock from '@/data/mock';
import type {
  Appointment,
  Caregiver,
  Medication,
  Message,
  Order,
  OrderStatus,
  Thread,
  ThreadTopic,
} from '@/data/types';
import * as api from '@/services/api';
import { useAuth } from '@/store/auth';

// Bump the version when the shape of DataState changes, so old saved data is dropped.
const STORAGE_KEY = 'demo-data.v1';

export type DataState = {
  medications: Medication[];
  orders: Order[];
  threads: Thread[];
  appointments: Appointment[];
  caregivers: Caregiver[];
  /** Whose records are being viewed ("Viewing medications for"). null = the user themself. */
  selectedPatientId: string | null;
};

const initialState = (): DataState => ({
  medications: mock.medications,
  orders: mock.orders,
  threads: mock.threads,
  appointments: mock.appointments,
  caregivers: mock.caregivers,
  selectedPatientId: null,
});

type Action =
  | { type: 'hydrate'; state: DataState }
  | { type: 'reset' }
  | { type: 'selectPatient'; patientId: string }
  | { type: 'addOrder'; order: Order }
  | { type: 'setOrderStatus'; orderId: string; status: OrderStatus }
  | { type: 'setArchived'; medicationId: string; archived: boolean }
  | { type: 'setAutoRefill'; medicationId: string; autoRefill: boolean }
  | { type: 'addMedication'; medication: Medication }
  | { type: 'addThread'; thread: Thread }
  | { type: 'addMessage'; threadId: string; message: Message; unread: boolean }
  | { type: 'markThreadRead'; threadId: string };

const DAY_MS = 24 * 60 * 60 * 1000;

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Message from the pharmacy telling the patient an order is ready. */
function orderReadyThread(order: Order, meds: Medication[]): Thread {
  const names = meds.filter((m) => order.medicationIds.includes(m.id)).map((m) => m.name);
  const text =
    order.pickup === 'delivery'
      ? `Your order is on its way: ${names.join(', ')}.`
      : `Your refill is ready for pickup at S. Lamar: ${names.join(', ')}.`;
  return {
    id: newId('t'),
    patientId: order.patientId,
    topic: 'refill',
    subject: 'Your recent refill order is ready for pickup',
    unread: true,
    messages: [
      { id: newId('msg'), fromMe: false, author: api.PHARMACY_STAFF, text, at: new Date().toISOString() },
    ],
  };
}

function updateMed(meds: Medication[], id: string, change: Partial<Medication>) {
  return meds.map((m) => (m.id === id ? { ...m, ...change } : m));
}

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'reset':
      return initialState();
    case 'selectPatient':
      return { ...state, selectedPatientId: action.patientId };
    case 'addOrder':
      return { ...state, orders: [action.order, ...state.orders] };
    case 'setOrderStatus': {
      const order = state.orders.find((o) => o.id === action.orderId);
      if (!order) return state;
      let medications = state.medications;
      // Picking up an order counts as a fill: next refill is due in 30 days.
      if (action.status === 'picked-up') {
        const now = Date.now();
        medications = medications.map((m) =>
          order.medicationIds.includes(m.id)
            ? {
                ...m,
                lastFilled: new Date(now).toISOString(),
                refillDue: new Date(now + 30 * DAY_MS).toISOString(),
              }
            : m,
        );
      }
      const threads =
        action.status === 'ready' && order.status !== 'ready'
          ? [orderReadyThread(order, state.medications), ...state.threads]
          : state.threads;
      return {
        ...state,
        medications,
        threads,
        orders: state.orders.map((o) => (o.id === order.id ? { ...o, status: action.status } : o)),
      };
    }
    case 'setArchived':
      return {
        ...state,
        medications: updateMed(state.medications, action.medicationId, { archived: action.archived }),
      };
    case 'setAutoRefill':
      return {
        ...state,
        medications: updateMed(state.medications, action.medicationId, {
          autoRefill: action.autoRefill,
        }),
      };
    case 'addMedication':
      return { ...state, medications: [action.medication, ...state.medications] };
    case 'addThread':
      return { ...state, threads: [action.thread, ...state.threads] };
    case 'addMessage':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? { ...t, unread: action.unread, messages: [...t.messages, action.message] }
            : t,
        ),
      };
    case 'markThreadRead':
      return {
        ...state,
        threads: state.threads.map((t) => (t.id === action.threadId ? { ...t, unread: false } : t)),
      };
  }
}

export type NewThreadInput = {
  patientId: string;
  topic: ThreadTopic;
  subject: string;
  text: string;
  imageUri?: string;
};

type DataContextValue = {
  state: DataState;
  isReady: boolean;
  /** Patient currently being viewed (defaults to the logged-in user). */
  currentPatientId: string;
  selectPatient: (patientId: string) => void;
  placeOrder: (req: api.OrderRequest) => Promise<Order>;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  setArchived: (medicationId: string, archived: boolean) => void;
  setAutoRefill: (medicationId: string, autoRefill: boolean) => void;
  addMedication: (med: Omit<Medication, 'id'>) => void;
  unreadCount: number;
  /** Threads where the fake pharmacist is "typing" a reply. */
  replyingThreadIds: string[];
  sendMessage: (threadId: string, text: string, imageUri?: string) => void;
  startThread: (input: NewThreadInput) => string;
  markThreadRead: (threadId: string) => void;
  resetDemoData: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [isReady, setIsReady] = useState(false);
  const [replyingThreadIds, setReplyingThreadIds] = useState<string[]>([]);

  const me = mock.patients.find((p) => p.id === user?.patientId);
  const myName = me ? `${me.firstName} ${me.lastName[0]}., ${user?.role}` : 'Me';

  function myMessage(text: string, imageUri?: string): Message {
    return { id: newId('msg'), fromMe: true, author: myName, text, imageUri, at: new Date().toISOString() };
  }

  // Fake pharmacist: answers each message after a short pause.
  function scheduleReply(threadId: string, text: string, hasImage: boolean) {
    setReplyingThreadIds((ids) => [...ids, threadId]);
    setTimeout(() => {
      const reply: Message = {
        id: newId('msg'),
        fromMe: false,
        author: api.PHARMACY_STAFF,
        text: api.pharmacyReply(text, hasImage),
        at: new Date().toISOString(),
      };
      dispatch({ type: 'addMessage', threadId, message: reply, unread: true });
      setReplyingThreadIds((ids) => ids.filter((id) => id !== threadId));
    }, api.REPLY_AFTER_MS);
  }

  // Load saved demo data once.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) dispatch({ type: 'hydrate', state: JSON.parse(saved) });
      } catch {
        // Corrupt or unreadable data: start fresh from the mock data.
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Save after every change.
  useEffect(() => {
    if (isReady) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, isReady]);

  // Fake pharmacy: submitted orders become "ready" after a short delay.
  useEffect(() => {
    const timers = state.orders
      .filter((o) => o.status === 'submitted')
      .map((o) => {
        const remaining = new Date(o.createdAt).getTime() + api.ORDER_READY_AFTER_MS - Date.now();
        return setTimeout(
          () => dispatch({ type: 'setOrderStatus', orderId: o.id, status: 'ready' }),
          Math.max(0, remaining),
        );
      });
    return () => timers.forEach(clearTimeout);
  }, [state.orders]);

  const value: DataContextValue = {
    state,
    isReady,
    currentPatientId: state.selectedPatientId ?? user?.patientId ?? mock.patients[0].id,
    selectPatient: (patientId) => dispatch({ type: 'selectPatient', patientId }),
    placeOrder: async (req) => {
      const order = await api.submitOrder(req);
      dispatch({ type: 'addOrder', order });
      return order;
    },
    setOrderStatus: (orderId, status) => dispatch({ type: 'setOrderStatus', orderId, status }),
    setArchived: (medicationId, archived) => dispatch({ type: 'setArchived', medicationId, archived }),
    setAutoRefill: (medicationId, autoRefill) =>
      dispatch({ type: 'setAutoRefill', medicationId, autoRefill }),
    addMedication: (med) =>
      dispatch({ type: 'addMedication', medication: { ...med, id: newId('m') } }),
    unreadCount: state.threads.filter((t) => t.unread).length,
    replyingThreadIds,
    sendMessage: (threadId, text, imageUri) => {
      dispatch({ type: 'addMessage', threadId, message: myMessage(text, imageUri), unread: false });
      scheduleReply(threadId, text, !!imageUri);
    },
    startThread: ({ patientId, topic, subject, text, imageUri }) => {
      const thread: Thread = {
        id: newId('t'),
        patientId,
        topic,
        subject,
        unread: false,
        messages: [myMessage(text, imageUri)],
      };
      dispatch({ type: 'addThread', thread });
      scheduleReply(thread.id, text, !!imageUri);
      return thread.id;
    },
    markThreadRead: (threadId) => dispatch({ type: 'markThreadRead', threadId }),
    resetDemoData: () => dispatch({ type: 'reset' }),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
