import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/providers/Providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'StudyAI — Aprende más rápido con inteligencia artificial',
    template: '%s | StudyAI',
  },
  description:
    'Sube tu PDF y StudyAI genera quizzes, flashcards y resúmenes automáticamente. La forma más inteligente de estudiar para exámenes.',
  keywords: [
    'estudiar con IA',
    'generador de quizzes',
    'flashcards automáticas',
    'resumen de PDF',
    'inteligencia artificial para estudiar',
    'quiz desde PDF',
  ],
  authors: [{ name: 'StudyAI' }],
  creator: 'StudyAI',
  publisher: 'StudyAI',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: 'StudyAI',
    title: 'StudyAI — Aprende más rápido con inteligencia artificial',
    description:
      'Sube tu PDF y genera quizzes, flashcards y resúmenes en segundos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudyAI — Aprendizaje con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyAI — Aprende más rápido con IA',
    description: 'Sube tu PDF y genera quizzes, flashcards y resúmenes en segundos.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'XYRY_IxlH1Tj-EHYd8wMm4LUxTp7n8_TIygo743N3SI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e1117',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8K34E4XXB2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8K34E4XXB2');
          `}
        </Script>
      </body>
    </html>
  );
}
