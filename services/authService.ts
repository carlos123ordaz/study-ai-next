import { api, handleApiError } from './api';
import type { User, ApiResponse } from '@/types';

export const authService = {
  async getMe(): Promise<User> {
    try {
      const { data } = await api.get<ApiResponse<User>>('/auth/me');
      return data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
  },

  // Next.js: process.env instead of import.meta.env
  getGoogleLoginUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    return `${apiUrl}/api/auth/google`;
  },
};
