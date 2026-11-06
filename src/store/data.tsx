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
  Order,
  OrderStatus,
  Thread,
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
  | { type: 'addMedication'; medication: Medication };

const DAY_MS = 24 * 60 * 60 * 1000;

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
      return {
        ...state,
        medications,
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
  }
}

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
  resetDemoData: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [isReady, setIsReady] = useState(false);

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
      dispatch({ type: 'addMedication', medication: { ...med, id: `m-${Date.now().toString(36)}` } }),
    resetDemoData: () => dispatch({ type: 'reset' }),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
