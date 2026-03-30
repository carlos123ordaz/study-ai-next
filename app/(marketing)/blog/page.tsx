import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Técnicas de estudio, IA y productividad académica',
  description:
    'Artículos sobre técnicas de estudio efectivas, cómo usar la IA para aprender más rápido, preparación para exámenes y productividad académica.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com'}/blog`,
  },
  openGraph: {
    title: 'Blog StudyAI — Técnicas de estudio e IA para aprender',
    description: 'Artículos sobre cómo estudiar mejor con inteligencia artificial.',
    type: 'website',
  },
};

// Static seed posts — replace with CMS/MDX fetch in production
const posts = [
  {
    slug: 'como-estudiar-con-ia',
    title: 'Cómo estudiar con IA: la guía definitiva para estudiantes',
    excerpt:
      'La inteligencia artificial está cambiando la forma de estudiar. Te explicamos cómo aprovecharla para preparar exámenes más rápido y con mejores resultados.',
    category: 'Técnicas de estudio',
    readingTime: '8 min',
    publishedAt: '2025-03-10',
    featured: true,
  },
  {
    slug: 'flashcards-vs-quizzes',
    title: 'Flashcards vs Quizzes: ¿cuál es mejor para memorizar?',
    excerpt:
      'Comparamos dos de las técnicas de estudio más efectivas basadas en evidencia científica. Spoiler: la respuesta depende de lo que querés aprender.',
    category: 'Ciencia del aprendizaje',
    readingTime: '5 min',
    publishedAt: '2025-03-05',
    featured: false,
  },
  {
    slug: 'spaced-repetition-para-principiantes',
    title: 'Repetición espaciada: qué es y cómo aplicarla con StudyAI',
    excerpt:
      'La repetición espaciada es el método más efectivo para retener información a largo plazo. Te explicamos la ciencia detrás y cómo usarla en tu estudio diario.',
    category: 'Ciencia del aprendizaje',
    readingTime: '6 min',
    publishedAt: '2025-02-28',
    featured: false,
  },
  {
    slug: 'preparar-examen-final-en-una-semana',
    title: 'Cómo preparar un examen final en una semana (con IA)',
    excerpt:
      'Plan de estudio día a día para cuando el tiempo apremia. Con StudyAI podés generar todo tu material de repaso en minutos.',
    category: 'Consejos de examen',
    readingTime: '7 min',
    publishedAt: '2025-02-20',
    featured: false,
  },
  {
    slug: 'mejores-extensiones-chrome-para-estudiantes',
    title: 'Las 7 mejores herramientas digitales para estudiantes en 2025',
    excerpt:
      'Desde gestores de tareas hasta generadores de quizzes con IA, estas herramientas transformarán tu forma de estudiar.',
    category: 'Herramientas',
    readingTime: '9 min',
    publishedAt: '2025-02-15',
    featured: false,
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Técnicas de estudio e{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              inteligencia artificial
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Artículos para estudiar mejor, aprender más rápido y sacarle todo el jugo a la IA.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block group mb-10">
          <article className="p-8 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-purple-500/5 hover:border-brand-500/40 transition-colors">
            <span className="text-xs font-medium text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded-full">
              Destacado
            </span>
            <h2 className="text-2xl font-bold mt-4 mb-3 group-hover:text-brand-400 transition-colors">
              {featured.title}
            </h2>
            <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {featured.readingTime}
                </span>
              </div>
              <span className="text-brand-400 text-sm font-medium flex items-center gap-1">
                Leer artículo <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </article>
        </Link>

        {/* Post grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="p-6 rounded-xl border border-white/[0.08] bg-card hover:border-white/[0.16] transition-colors h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-muted-foreground">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingTime}
                  </span>
                </div>
                <h2 className="font-bold mb-2 group-hover:text-brand-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
