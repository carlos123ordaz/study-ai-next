import { api, handleApiError } from './api';
import type { CreditTransaction, CreditPackage, Payment, ApiResponse } from '@/types';

export interface PackagesResponse { packages: CreditPackage[]; providers: string[]; }

export const creditService = {
  async getBalance(): Promise<number> {
    try {
      const { data } = await api.get<ApiResponse<{ credits: number }>>('/credits');
      return data.data!.credits;
    } catch (error) { handleApiError(error); }
  },

  async getTransactions(page = 1, limit = 20): Promise<{ transactions: CreditTransaction[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<CreditTransaction[]>>('/credits/transactions', { params: { page, limit } });
      return { transactions: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },

  async getPackages(): Promise<PackagesResponse> {
    try {
      const { data } = await api.get<ApiResponse<PackagesResponse>>('/payments/packages');
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async initiatePayment(packageIndex: number, provider?: string): Promise<{ payment: Payment; checkoutUrl?: string; package: CreditPackage }> {
    try {
      const { data } = await api.post<ApiResponse<{ payment: Payment; checkoutUrl?: string; package: CreditPackage }>>('/payments', { packageIndex, provider });
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async confirmPayment(paymentId: string, transactionData?: { mpPaymentId?: string; mpStatus?: string }): Promise<Payment> {
    try {
      const { data } = await api.post<ApiResponse<Payment>>(`/payments/${paymentId}/confirm`, transactionData ?? {});
      return data.data!;
    } catch (error) { handleApiError(error); }
  },

  async getPaymentHistory(page = 1, limit = 20): Promise<{ payments: Payment[]; total: number; pages: number }> {
    try {
      const { data } = await api.get<ApiResponse<Payment[]>>('/payments', { params: { page, limit } });
      return { payments: data.data!, total: data.meta?.pagination?.total ?? 0, pages: data.meta?.pagination?.pages ?? 1 };
    } catch (error) { handleApiError(error); }
  },
};
