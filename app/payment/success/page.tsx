import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pago exitoso — StudyAI',
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
        <p className="text-muted-foreground mb-8">
          Tus créditos ya están disponibles en tu cuenta.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
