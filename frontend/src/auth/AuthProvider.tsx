import { useEffect, useMemo, useState } from 'react';

import { api, setAuthToken } from '../api/api';
import type { AuthedUser, UserRole } from './authTypes';
import { AuthContext, type AuthContextValue, type AuthState } from './authContext';
import { readStoredAuth, writeStoredAuth } from './authStorage';

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
      const resp = await api.post('/login', { email, password });
      const idToken = resp.data?.idToken as string;
      const user = resp.data?.user as AuthedUser;
      if (!idToken || !user?.uid) throw new Error('Login failed');
      writeStoredAuth({ idToken, user });
      setState({ idToken, user, loading: false });
    };

    const register = async (payload: { name: string; email: string; password: string; role?: UserRole }) => {
      await api.post('/register', payload);
    };

    const logout = () => {
      writeStoredAuth(null);
      setState({ idToken: null, user: null, loading: false });
    };

    return { ...state, login, register, logout };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

