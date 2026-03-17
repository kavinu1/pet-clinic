import type { AuthedUser } from './authTypes';

const STORAGE_KEY = 'pet_clinic_auth_v1';

export function readStoredAuth(): { idToken: string; user: AuthedUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { idToken: string; user: AuthedUser };
    if (!parsed?.idToken || !parsed?.user?.uid) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredAuth(value: { idToken: string; user: AuthedUser } | null) {
  if (!value) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

