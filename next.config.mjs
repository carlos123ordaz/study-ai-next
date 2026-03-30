/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for catching bugs early
  reactStrictMode: true,

  // Enable image optimization for external domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Trailing slash normalization (canonical URLs)
  trailingSlash: false,

  // Compress responses
  compress: true,

  // Headers for security + performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(_next/static|favicon|og-image)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirect www to non-www (canonical)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.studyai.com' }],
        destination: 'https://studyai.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
