import axios from 'axios';

const envApiUrlRaw = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const envApiUrl = envApiUrlRaw ? envApiUrlRaw.replace(/\/+$/, '') : undefined;
const apiBaseUrl = envApiUrl || '/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(idToken: string | null) {
  if (idToken) api.defaults.headers.common.Authorization = `Bearer ${idToken}`;
  else delete api.defaults.headers.common.Authorization;
}
