import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { User } from '@/data/types';
import * as api from '@/services/api';

const SESSION_KEY = 'session.userId';

type AuthState = {
  user: User | null;
  isLoading: boolean; // true while restoring a saved session on app start
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedId = await AsyncStorage.getItem(SESSION_KEY);
        if (savedId) setUser(await api.getUser(savedId));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const loggedIn = await api.login(email, password);
    await AsyncStorage.setItem(SESSION_KEY, loggedIn.id);
    setUser(loggedIn);
  }

  async function signOut() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
