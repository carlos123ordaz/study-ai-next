import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pago cancelado — StudyAI',
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pago cancelado</h1>
        <p className="text-muted-foreground mb-8">
          No se realizó ningún cargo. Podés intentarlo de nuevo cuando quieras.
        </p>
        <Link
          href="/credits"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Volver a Créditos
        </Link>
      </div>
    </div>
  );
}
