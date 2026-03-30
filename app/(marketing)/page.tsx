import type { Metadata } from 'next';
import { LandingClient } from '@/components/pages/LandingClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com';

export const metadata: Metadata = {
  title: 'StudyAI — Genera quizzes y flashcards desde tus PDFs con IA',
  description:
    'Sube tu material de estudio en PDF y StudyAI genera automáticamente quizzes personalizados, flashcards y resúmenes. Preparate para cualquier examen en minutos.',
  keywords: [
    'generador de quizzes con IA',
    'flashcards automáticas PDF',
    'resumen PDF inteligencia artificial',
    'estudiar para examen',
    'quiz desde apuntes',
    'herramienta de estudio IA',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'StudyAI — Genera quizzes y flashcards desde tus PDFs',
    description: 'Sube tu PDF y genera quizzes, flashcards y resúmenes en segundos.',
    url: SITE_URL,
    type: 'website',
  },
};

// JSON-LD structured data for Google rich results
function SoftwareAppJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StudyAI',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
      'Plataforma de aprendizaje con IA que genera quizzes, flashcards y resúmenes desde PDFs.',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ARS',
      description: 'Plan gratuito disponible',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <SoftwareAppJsonLd />
      <LandingClient />
    </>
  );
}
