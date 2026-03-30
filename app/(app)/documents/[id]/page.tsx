// MIGRATION: Copy src/pages/DocumentDetail.tsx to components/pages/app/DocumentDetail.tsx
// Add 'use client' at top
// Replace: useParams from react-router-dom → useParams from next/navigation
// Replace: useNavigate → useRouter from next/navigation
export { default } from '@/components/pages/app/DocumentDetail';
