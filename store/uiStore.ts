'use client';

import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface UiState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
  };
}

let toastId = 0;

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = String(++toastId);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  toast: {
    success: (title, description) => get().addToast({ title, description, variant: 'success' }),
    error: (title, description) => get().addToast({ title, description, variant: 'error' }),
    warning: (title, description) => get().addToast({ title, description, variant: 'warning' }),
    info: (title, description) => get().addToast({ title, description, variant: 'default' }),
  },
}));
