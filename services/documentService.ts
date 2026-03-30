import { api, handleApiError } from './api';
import type { StudyDocument, ApiResponse } from '@/types';

export const documentService = {
  async upload(file: File): Promise<StudyDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<ApiResponse<StudyDocument>>('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async list(page = 1, limit = 20): Promise<{ data: StudyDocument[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<StudyDocument[]>>('/documents', { params: { page, limit } });
      return { data: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },

  async get(id: string): Promise<StudyDocument> {
    try {
      const { data } = await api.get<ApiResponse<StudyDocument>>(`/documents/${id}`);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) { handleApiError(error); }
  },
};
