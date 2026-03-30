import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studyai.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow crawling all public marketing pages
        userAgent: '*',
        allow: ['/', '/features', '/pricing', '/faq', '/blog'],
        // Block private app routes from indexing
        disallow: [
          '/dashboard',
          '/documents',
          '/quizzes',
          '/flashcards',
          '/summaries',
          '/credits',
          '/profile',
          '/auth/',
          '/payment/',
          '/login',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
