import { api, handleApiError } from './api';
import type { Quiz, Question, Attempt, CreateQuizInput, QuizCostBreakdown, UserAnswer, ApiResponse } from '@/types';

export const quizService = {
  async estimateCost(input: Omit<CreateQuizInput, 'documentIds' | 'title'>): Promise<QuizCostBreakdown> {
    try {
      const { data } = await api.post<ApiResponse<QuizCostBreakdown>>('/quizzes/estimate', input);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async create(input: CreateQuizInput): Promise<Quiz> {
    try {
      const { data } = await api.post<ApiResponse<Quiz>>('/quizzes', input, { timeout: 120000 });
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async list(page = 1, limit = 20): Promise<{ data: Quiz[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<Quiz[]>>('/quizzes', { params: { page, limit } });
      return { data: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },

  async get(id: string): Promise<{ quiz: Quiz; questions: Question[] }> {
    try {
      const { data } = await api.get<ApiResponse<{ quiz: Quiz; questions: Question[] }>>(`/quizzes/${id}`);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async getReview(id: string): Promise<{ quiz: Quiz; questions: Question[] }> {
    try {
      const { data } = await api.get<ApiResponse<{ quiz: Quiz; questions: Question[] }>>(`/quizzes/${id}/review`);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async submitAttempt(quizId: string, answers: UserAnswer[], timeSpentSeconds?: number): Promise<Attempt> {
    try {
      const { data } = await api.post<ApiResponse<Attempt>>(`/quizzes/${quizId}/attempts`, { answers, timeSpentSeconds });
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async getAttempt(attemptId: string): Promise<{ attempt: Attempt; quiz: Quiz; questions: Question[] }> {
    try {
      const { data } = await api.get<ApiResponse<{ attempt: Attempt; quiz: Quiz; questions: Question[] }>>(`/quizzes/attempts/${attemptId}`);
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/quizzes/${id}`);
    } catch (error) { handleApiError(error); }
  },

  async listAttempts(page = 1, limit = 20): Promise<{ data: Attempt[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<Attempt[]>>('/quizzes/attempts/me', { params: { page, limit } });
      return { data: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },
};
