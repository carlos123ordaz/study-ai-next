import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com';

// In production: replace with CMS/MDX fetch
const posts: Record<string, {
  title: string;
  description: string;
  content: string;
  category: string;
  readingTime: string;
  publishedAt: string;
}> = {
  'como-estudiar-con-ia': {
    title: 'Cómo estudiar con IA: la guía definitiva para estudiantes',
    description:
      'La inteligencia artificial está cambiando la forma de estudiar. Te explicamos cómo aprovecharla para preparar exámenes más rápido.',
    category: 'Técnicas de estudio',
    readingTime: '8 min',
    publishedAt: '2025-03-10',
    content: `
## Por qué la IA cambia la forma de estudiar

Durante décadas, estudiar significó leer, subrayar y repetir. Hoy, herramientas como StudyAI permiten
transformar cualquier documento en material de estudio interactivo en segundos.

## Las 3 herramientas que más ayudan

### 1. Quizzes generados automáticamente

Generar preguntas desde tu propio material es una de las técnicas más efectivas según la ciencia del
aprendizaje. Se llama **práctica de recuperación** (*retrieval practice*) y está demostrado que mejora
la retención a largo plazo.

Con StudyAI, simplemente subís tu PDF y la IA genera hasta 50 preguntas personalizadas.

### 2. Flashcards con espaciado

Las flashcards combinadas con repetición espaciada son el método más eficiente para memorizar
vocabulario, fechas, fórmulas y conceptos clave.

### 3. Resúmenes estructurados

Antes de entrar en detalle, un buen resumen te da el mapa completo del tema. StudyAI extrae las
ideas principales y las organiza con jerarquía.

## Plan de estudio con IA en 4 pasos

1. **Subí tu PDF** → obtenés el resumen para primera lectura
2. **Creá flashcards** → memorización de términos clave
3. **Generá un quiz** → práctica de recuperación
4. **Analizá errores** → reforzá lo que falló

## Conclusión

La IA no reemplaza el estudio, lo potencia. Usada correctamente, podés preparar el mismo material
en la mitad del tiempo con mejores resultados.
    `.trim(),
  },
};

// Generate static params for known slugs
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${SITE_URL}/blog/${params.slug}`,
      publishedTime: post.publishedAt,
    },
  };
}

function ArticleJsonLd({ slug, post }: { slug: string; post: typeof posts[string] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          url: `${SITE_URL}/blog/${slug}`,
          publisher: {
            '@type': 'Organization',
            name: 'StudyAI',
            url: SITE_URL,
          },
          author: {
            '@type': 'Organization',
            name: 'StudyAI',
          },
        }),
      }}
    />
  );
}

// Minimal markdown-like renderer — replace with MDX in production
function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
      return <li key={i} className="ml-4 text-muted-foreground mb-1">{line.slice(3)}</li>;
    }
    if (line.trim() === '') return <br key={i} />;
    // Bold text
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-2">
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{p}</strong> : p)}
      </p>
    );
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd slug={params.slug} post={post} />
      <main className="py-16 md:py-24">
        <article className="max-w-2xl mx-auto px-4">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 font-medium">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readingTime}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{post.description}</p>

          <div className="border-t border-white/[0.08] pt-8">
            {renderContent(post.content)}
          </div>

          {/* CTA */}
          <div className="mt-16 p-6 rounded-xl border border-brand-500/20 bg-brand-500/5 text-center">
            <h2 className="font-bold mb-2">Probalo gratis con tu próximo examen</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Subí tu PDF y StudyAI genera el material de estudio en segundos.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
              Empezar gratis
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
