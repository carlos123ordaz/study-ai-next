import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — StudyAI FAQ',
  description:
    'Respondemos todas tus dudas sobre StudyAI: formatos de archivos, créditos, idiomas, seguridad de datos, tipos de preguntas y más.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com'}/faq`,
  },
  openGraph: {
    title: 'FAQ StudyAI — Preguntas frecuentes',
    description: 'Todo lo que necesitás saber sobre cómo funciona StudyAI.',
    type: 'website',
  },
};

// JSON-LD FAQ for Google rich snippets
function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }),
      }}
    />
  );
}

const faqSections = [
  {
    title: 'Primeros pasos',
    faqs: [
      {
        question: '¿Qué es StudyAI?',
        answer:
          'StudyAI es una plataforma de aprendizaje potenciada por inteligencia artificial. Subís tus PDFs y automáticamente genera quizzes personalizados, flashcards y resúmenes estructurados para que estudies mejor.',
      },
      {
        question: '¿Necesito crear una cuenta?',
        answer:
          'Sí, necesitás una cuenta para guardar tus documentos y resultados. Podés registrarte con Google en segundos, sin formularios largos.',
      },
      {
        question: '¿Es gratis?',
        answer:
          'Al crear tu cuenta recibís créditos gratuitos para empezar. Con esos créditos podés generar varios quizzes, sets de flashcards y resúmenes. Podés recargar más créditos cuando quieras.',
      },
    ],
  },
  {
    title: 'Archivos y documentos',
    faqs: [
      {
        question: '¿Qué tipo de archivos puedo subir?',
        answer:
          'Actualmente soportamos PDF. El archivo puede pesar hasta 50 MB. Próximamente agregaremos soporte para Word (.docx) y texto plano (.txt).',
      },
      {
        question: '¿Funciona con PDFs escaneados?',
        answer:
          'Funciona mejor con PDFs digitales (texto seleccionable). Para PDFs escaneados (imágenes), la calidad del resultado puede variar según la resolución del escaneo. Estamos mejorando el soporte para OCR.',
      },
      {
        question: '¿Cuántos documentos puedo tener?',
        answer:
          'No hay límite de documentos. Podés subir todos los PDFs que necesites y generar material de estudio para cada uno.',
      },
    ],
  },
  {
    title: 'Quizzes y preguntas',
    faqs: [
      {
        question: '¿Qué tipos de preguntas genera?',
        answer:
          'StudyAI genera 5 tipos: opción múltiple (una respuesta), selección múltiple (varias respuestas), verdadero/falso, completar espacios en blanco y respuesta corta.',
      },
      {
        question: '¿Puedo elegir la dificultad?',
        answer:
          'Sí. Al crear un quiz elegís entre fácil, medio y difícil. La IA adapta las preguntas al nivel seleccionado.',
      },
      {
        question: '¿Cuántas preguntas puede tener un quiz?',
        answer:
          'Entre 5 y 50 preguntas por quiz. Podés crear múltiples quizzes del mismo documento con distintas configuraciones.',
      },
    ],
  },
  {
    title: 'Seguridad y privacidad',
    faqs: [
      {
        question: '¿Mis documentos están seguros?',
        answer:
          'Sí. Tus PDFs se almacenan de forma cifrada y solo los usa la IA para generar tu material de estudio. No los compartimos con terceros ni los usamos para entrenar modelos.',
      },
      {
        question: '¿Puedo eliminar mis documentos?',
        answer:
          'Sí, en cualquier momento desde la sección "Documentos" de tu cuenta. Al eliminar un documento, también se elimina todo el material generado a partir de él.',
      },
    ],
  },
  {
    title: 'Créditos y pagos',
    faqs: [
      {
        question: '¿Cuántos créditos consume cada acción?',
        answer:
          'Depende de la complejidad. Un quiz de 10 preguntas consume entre 8 y 12 créditos. Un set de flashcards o un resumen también entre 8 y 12. El costo exacto se muestra antes de confirmar.',
      },
      {
        question: '¿Los créditos vencen?',
        answer:
          'No. Los créditos no tienen fecha de vencimiento.',
      },
      {
        question: '¿Puedo pedir reembolso?',
        answer:
          'Sí, dentro de las 24 horas de la compra si no usaste los créditos.',
      },
    ],
  },
];

// Flatten for JSON-LD
const allFaqs = faqSections.flatMap((s) => s.faqs);

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd items={allFaqs} />
      <main className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Preguntas frecuentes
            </h1>
            <p className="text-lg text-muted-foreground">
              Todo lo que necesitás saber sobre StudyAI.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold mb-4 text-brand-400">{section.title}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${section.title}-${i}`}
                      className="border border-white/[0.08] rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-medium hover:no-underline text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 rounded-2xl border border-white/[0.08] bg-card">
            <h2 className="text-xl font-bold mb-2">¿No encontraste tu respuesta?</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Probalo gratis y si tenés dudas podés contactarnos desde tu cuenta.
            </p>
            <Link href="/login">
              <span className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
