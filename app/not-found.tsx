import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="rounded-xl bg-brand-500 p-3 mb-6">
        <BookOpen className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
