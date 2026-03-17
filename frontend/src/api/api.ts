import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(idToken: string | null) {
  if (idToken) api.defaults.headers.common.Authorization = `Bearer ${idToken}`;
  else delete api.defaults.headers.common.Authorization;
}

