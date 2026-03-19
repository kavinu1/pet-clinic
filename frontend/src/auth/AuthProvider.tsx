import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { api, setAuthToken } from '../api/api';
import type { AuthedUser, UserRole } from './authTypes';
import { AuthContext, type AuthContextValue, type AuthState } from './authContext';
import { readStoredAuth, writeStoredAuth } from './authStorage';

async function pingApiHost(baseUrl: string) {
  try {
    const healthUrl = new URL('/health', baseUrl).toString();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 3000);
    try {
      await fetch(healthUrl, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: controller.signal });
      return { reachable: true as const, healthUrl };
    } finally {
      window.clearTimeout(timeoutId);
    }
  } catch {
    return { reachable: false as const };
  }
}

async function toAuthError(err: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: unknown } | undefined;
    if (typeof data?.error === 'string' && data.error.trim()) return new Error(data.error);
    if (err.response) {
      const base = api.defaults.baseURL ? ` (${api.defaults.baseURL})` : '';
      return new Error(`Request failed (${err.response.status})${base}.`);
    }
    if (err.code === 'ERR_NETWORK') {
      const base = api.defaults.baseURL ? ` (${api.defaults.baseURL})` : '';
      const baseUrl = api.defaults.baseURL;
      if (baseUrl && /^https?:\/\//i.test(baseUrl)) {
        const ping = await pingApiHost(baseUrl);
        if (ping.reachable) {
          return new Error(
            `Cannot reach the API${base}. The host is reachable, but the browser blocked the request (likely CORS).`
          );
        }
      }
      return new Error(`Cannot reach the API${base}. Check VITE_API_URL and backend status.`);
    }
  }
  return err instanceof Error ? err : new Error(fallbackMessage);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = readStoredAuth();
  const [state, setState] = useState<AuthState>(() => ({
    idToken: stored?.idToken ?? null,
    user: stored?.user ?? null,
    loading: false,
  }));

  useEffect(() => {
    setAuthToken(state.idToken);
  }, [state.idToken]);

  const value = useMemo<AuthContextValue>(() => {
    const login = async (email: string, password: string) => {
      try {
        const resp = await api.post('/login', { email, password });
        const idToken = resp.data?.idToken as string;
        const user = resp.data?.user as AuthedUser;
        if (!idToken || !user?.uid) throw new Error('Login failed');
        writeStoredAuth({ idToken, user });
        setState({ idToken, user, loading: false });
      } catch (err) {
        throw await toAuthError(err, 'Login failed');
      }
    };

    const register = async (payload: { name: string; email: string; password: string; role?: UserRole }) => {
      try {
        await api.post('/register', payload);
      } catch (err) {
        throw await toAuthError(err, 'Registration failed');
      }
    };

    const logout = () => {
      writeStoredAuth(null);
      setState({ idToken: null, user: null, loading: false });
    };

    return { ...state, login, register, logout };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
