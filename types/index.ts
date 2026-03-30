// Exact copy from src/types/index.ts — no changes needed
export interface User {
  id: string; email: string; name: string; avatar?: string; credits: number; createdAt: string;
}

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';

export interface StudyDocument {
  _id: string; userId: string; name: string; originalName: string; size: number;
  pageCount?: number; fileHash: string; storageUrl: string; status: DocumentStatus;
  errorMessage?: string; textLength?: number; chunkCount?: number;
  processingCreditsUsed: number; createdAt: string; updatedAt: string;
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_in_blank' | 'short_answer';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuizStatus = 'generating' | 'ready' | 'failed';

export interface Quiz {
  _id: string; userId: string; documentIds: string[]; title: string;
  questionTypes: QuestionType[]; difficulty: DifficultyLevel; questionCount: number;
  includeExplanations: boolean; status: QuizStatus; creditsUsed: number;
  errorMessage?: string; createdAt: string; updatedAt: string;
}

export interface QuestionOption { id: string; text: string; }

export interface Question {
  _id: string; quizId: string; type: QuestionType; difficulty: DifficultyLevel;
  text: string; options?: QuestionOption[]; correctAnswer?: string | string[];
  explanation?: string; order: number;
}

export interface AnswerResult {
  questionId: string; userAnswer: string | string[];
  isCorrect: boolean; isPartiallyCorrect?: boolean; pointsEarned: number;
}

export interface Attempt {
  _id: string; userId: string; quizId: string | Quiz; answers: AnswerResult[];
  score: number; correctCount: number; totalQuestions: number;
  timeSpentSeconds?: number; completedAt: string; createdAt: string;
}

export type FlashcardSetStatus = 'generating' | 'ready' | 'failed';
export interface Flashcard { front: string; back: string; }
export interface FlashcardSet {
  _id: string; userId: string; documentId: string; title: string;
  cards: Flashcard[]; cardCount: number; status: FlashcardSetStatus;
  creditsUsed: number; errorMessage?: string; createdAt: string; updatedAt: string;
}

export type SummaryStatus = 'generating' | 'ready' | 'failed';
export interface SummarySection { heading: string; body: string; }
export interface KeyTerm { term: string; definition: string; }
export interface SummaryContent { overview: string; sections: SummarySection[]; keyTerms: KeyTerm[]; }
export interface Summary {
  _id: string; userId: string; documentId: string; title: string;
  content: SummaryContent; status: SummaryStatus; creditsUsed: number;
  errorMessage?: string; createdAt: string; updatedAt: string;
}

export type TransactionType =
  | 'initial_grant' | 'document_processing' | 'quiz_generation'
  | 'quiz_generation_refund' | 'document_processing_refund' | 'flashcard_generation'
  | 'flashcard_generation_refund' | 'summary_generation' | 'summary_generation_refund'
  | 'payment_recharge' | 'admin_adjustment';

export interface CreditTransaction {
  _id: string; userId: string; type: TransactionType; amount: number;
  balanceBefore: number; balanceAfter: number; status: string;
  description: string; referenceId?: string; createdAt: string;
}

export interface CreditPackage { credits: number; priceUsd: number; label: string; }
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export interface Payment {
  _id: string; userId: string; provider: string; externalPaymentId?: string;
  status: PaymentStatus; creditsAmount: number; priceUsd: number;
  currency: string; completedAt?: string; createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean; data?: T; message?: string; error?: string;
  meta?: { pagination?: Pagination; [key: string]: unknown };
}

export interface Pagination { page: number; limit: number; total: number; pages: number; }

export interface CreateQuizInput {
  documentIds: string[]; title?: string; questionTypes: QuestionType[];
  difficulty: DifficultyLevel; questionCount: number; includeExplanations: boolean;
}

export interface QuizCostBreakdown {
  baseCost: number; difficultyMultiplier: number; explanationCost: number; total: number; perQuestion: number;
}

export interface UserAnswer { questionId: string; answer: string | string[]; }

// Paginated list response helper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}
