import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Next.js: NEXT_PUBLIC_ prefix instead of VITE_
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Safe localStorage access (only runs client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      if (!window.location.pathname.match(/^\/(login|$)/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Set a browser cookie so Next.js middleware can read it
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    // Remove the browser cookie
    document.cookie = 'token=; path=/; max-age=0';
  }
}

// Alias kept for backwards compatibility
export const setAuthToken = setStoredToken;

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromAxiosError(error: AxiosError): ApiError {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    const message = data?.error ?? data?.message ?? error.message ?? 'An error occurred';
    const statusCode = error.response?.status ?? 500;
    return new ApiError(message, statusCode, data);
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) throw ApiError.fromAxiosError(error);
  throw error;
}
