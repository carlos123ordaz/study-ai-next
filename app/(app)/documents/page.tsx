// MIGRATION: Copy src/pages/Documents.tsx to components/pages/app/Documents.tsx
// Add 'use client' at top
// Replace: import { useNavigate, Link } from 'react-router-dom'
// With:    import { useRouter } from 'next/navigation'; import Link from 'next/link'
// Replace: navigate('/path') → router.push('/path')
export { default } from '@/components/pages/app/Documents';
