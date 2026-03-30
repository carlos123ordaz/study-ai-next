import { api, handleApiError } from './api';
import type { Summary, ApiResponse } from '@/types';

export const summaryService = {
  async estimateCost(): Promise<{ total: number }> {
    try {
      const { data } = await api.get<ApiResponse<{ total: number }>>('/summaries/estimate');
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async create(documentId: string): Promise<Summary> {
    try {
      const { data } = await api.post<ApiResponse<Summary>>('/summaries', { documentId }, { timeout: 120000 });
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async list(page = 1, limit = 20): Promise<{ data: Summary[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<Summary[]>>('/summaries', { params: { page, limit } });
      return { data: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },

  async get(id: string): Promise<Summary> {
    try {
      const { data } = await api.get<ApiResponse<Summary>>(`/summaries/${id}`);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/summaries/${id}`);
    } catch (error) { handleApiError(error); }
  },
};
