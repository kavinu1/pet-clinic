import { createContext } from 'react';

import type { AuthedUser, UserRole } from './authTypes';

export type AuthState = {
  idToken: string | null;
  user: AuthedUser | null;
  loading: boolean;
};

export type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

