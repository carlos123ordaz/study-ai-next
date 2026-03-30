import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}min`;
  return 'ahora mismo';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  single_choice: 'Opción múltiple',
  multiple_choice: 'Selección múltiple',
  true_false: 'Verdadero/Falso',
  fill_in_blank: 'Completar espacios',
  short_answer: 'Respuesta corta',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil', medium: 'Media', hard: 'Difícil',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-red-400',
};
