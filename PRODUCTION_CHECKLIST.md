# Checklist de producción — StudyAI Next.js

## 1. Migración de páginas pendientes

Copiá estos archivos de `frontend/src/pages/` a `frontend-next/components/pages/app/`:
- [ ] `Documents.tsx` → add `'use client'`, replace `useNavigate`/`Link`
- [ ] `DocumentDetail.tsx` → add `'use client'`, replace `useParams`, `useNavigate`
- [ ] `Quizzes.tsx` → add `'use client'`, replace router imports
- [ ] `CreateQuiz.tsx` → add `'use client'`, replace router imports
- [ ] `TakeQuiz.tsx` → add `'use client'`, replace router imports
- [ ] `QuizResults.tsx` → add `'use client'`, replace router imports
- [ ] `Flashcards.tsx` → add `'use client'`, replace router imports
- [ ] `StudyFlashcards.tsx` → add `'use client'`, replace router imports
- [ ] `Summaries.tsx` → add `'use client'`, replace router imports
- [ ] `ViewSummary.tsx` → add `'use client'`, replace router imports
- [ ] `Credits.tsx` → add `'use client'`, replace router imports
- [ ] `Profile.tsx` → add `'use client'`, replace router imports

**Patrón de migración para cada archivo:**
```diff
- import { useNavigate, useParams, Link } from 'react-router-dom'
+ import { useRouter, useParams } from 'next/navigation'
+ import Link from 'next/link'

- const navigate = useNavigate()
+ const router = useRouter()

- navigate('/path')
+ router.push('/path')

- const { id } = useParams()   // misma API, distinto import
+ const { id } = useParams<{ id: string }>()

- export function PageName()
+ export default function PageName()   // Next.js requiere default export en page.tsx
```

## 2. Componentes UI

Copiar carpeta `frontend/src/components/ui/` a `frontend-next/components/ui/`.
Agregar `'use client'` a todos los componentes que usen hooks o eventos.

```bash
cp -r frontend/src/components/ui/ frontend-next/components/ui/
```

Luego correr find & replace en todos los archivos:
- En la mayoría alcanza con agregar `'use client'` en la primera línea.

## 3. Variables de entorno

| Vite (React)           | Next.js                   |
|------------------------|---------------------------|
| `VITE_API_URL`         | `NEXT_PUBLIC_API_URL`     |
| `VITE_SITE_URL`        | `NEXT_PUBLIC_SITE_URL`    |

En Vercel, configurar estas variables en Settings → Environment Variables.

## 4. Imagen OG (Open Graph)

Crear `frontend-next/public/og-image.png` (1200×630px).
Herramientas: Figma, Canva, o usar `next/og` para generarla dinámicamente.

## 5. Middleware de autenticación

El middleware usa cookies HTTP para proteger rutas. Verificar que el backend
setea una cookie `token` o `auth_token` al hacer login.

Si el backend solo retorna el token por URL/query param, actualizar el middleware:
```typescript
// middleware.ts — cambiar nombre de cookie si es necesario
const token = request.cookies.get('tu_nombre_de_cookie')?.value;
```

## 6. Sitemap dinámico (blog)

Cuando agregues posts reales, actualizá `app/sitemap.ts`:
```typescript
// Opción A: archivos MDX en /content/blog/
import { getAllPosts } from '@/lib/blog';
const posts = await getAllPosts();
const blogPages = posts.map(p => ({
  url: `${SITE_URL}/blog/${p.slug}`,
  lastModified: new Date(p.updatedAt),
  changeFrequency: 'monthly',
  priority: 0.7,
}));
```

## 7. Google Search Console

- [ ] Verificar propiedad del sitio
- [ ] Enviar sitemap: `https://studyai.com/sitemap.xml`
- [ ] Comprobar cobertura de URLs indexadas
- [ ] Activar Core Web Vitals report

## 8. Core Web Vitals — checklist

- [ ] **LCP < 2.5s**: usar `next/image` con `priority` en imágenes hero
- [ ] **FID / INP < 200ms**: no bloquear el hilo principal en renderizado inicial
- [ ] **CLS < 0.1**: definir width/height en todas las imágenes
- [ ] Activar `next/font` para Google Fonts (evita layout shift)
- [ ] Revisar bundle size con `next build` + `@next/bundle-analyzer`

## 9. next/font (recomendado)

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`dark ${inter.className}`}>
      ...
    </html>
  );
}
```

## 10. Vercel deployment

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend-next
vercel --prod

# Configurar env vars en Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://api.studyai.com
# NEXT_PUBLIC_SITE_URL = https://studyai.com
```

## 11. Canonical URLs

Cada página pública tiene `alternates.canonical`. En producción:
- Verificar que `NEXT_PUBLIC_SITE_URL` esté seteado correctamente.
- Si usás www, configurar redirect en `next.config.ts` (ya incluido).

## 12. Structured data / JSON-LD

Páginas con JSON-LD implementado:
- [x] Homepage: `SoftwareApplication`
- [x] /pricing: `PriceSpecification`
- [x] /faq: `FAQPage` (Google rich snippets)
- [x] /blog/[slug]: `BlogPosting`

Pendiente:
- [ ] `/features`: `ItemList` o `HowTo`

## 13. SEO — páginas nuevas para keywords

| URL             | Keyword objetivo                          | Estado |
|-----------------|-------------------------------------------|--------|
| `/`             | "quiz desde PDF con IA"                   | ✅     |
| `/features`     | "funcionalidades StudyAI"                 | ✅     |
| `/pricing`      | "precio herramienta estudio IA"           | ✅     |
| `/faq`          | "preguntas frecuentes StudyAI"            | ✅     |
| `/blog`         | "técnicas de estudio IA"                  | ✅     |
| `/blog/[slug]`  | keywords long-tail por artículo           | ✅     |
| `/pricing`      | "alternativa Quizlet con IA"              | 🔲 agregar copy |

## 14. robots.txt

Verificar en producción: `https://studyai.com/robots.txt`
Debe bloquear `/dashboard`, `/documents`, etc.

## 15. Instalación del proyecto

```bash
cd frontend-next
npm install
npm run dev       # http://localhost:3000
npm run build     # verificar que buildeé sin errores
npm run type-check
```
