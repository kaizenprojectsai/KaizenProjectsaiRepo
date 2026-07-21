# 🏗️ FASE 1: FUNDACIÓN — Setup Inicial

> **Duración:** Semanas 1-2  
> **Objetivo:** Tener infraestructura gratuita funcional con CI/CD, base de datos, autenticación y UI base  
> **Costo:** $0/mes

---

## 📋 Checklist de Fundación

- [ ] **Paso 1:** Crear repositorio monorepo con Turborepo
- [ ] **Paso 2:** Configurar Next.js + TypeScript + Tailwind
- [ ] **Paso 3:** Configurar Supabase (PostgreSQL + Auth + Storage)
- [ ] **Paso 4:** Implementar autenticación completa
- [ ] **Paso 5:** Crear sistema de layouts y navegación
- [ ] **Paso 6:** Configurar CI/CD con GitHub Actions
- [ ] **Paso 7:** Deploy automático a Vercel
- [ ] **Paso 8:** Configurar monitoreo básico (Sentry)

---

## 🔧 Paso 1: Monorepo con Turborepo

```bash
# Crear el proyecto
npx create-turbo@latest kaizen-project --example with-supabase
cd kaizen-project

# Estructura resultante:
kaizen-project/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # API server (opcional)
│   └── docs/         # Documentación (Nextra/Docusaurus)
├── packages/
│   ├── ui/           # Componentes compartidos
│   ├── database/     # Esquemas + migraciones Supabase
│   └── ai/           # Integración con LLM
├── packages/
│   ├── config/       # ESLint, TypeScript, Tailwind configs
│   └── utils/        # Utilidades compartidas
├── tooling/          # Scripts de automatización
└── .github/
    └── workflows/    # CI/CD pipelines
```

---

## 📦 Paso 2: Stack Frontend Base

### Dependencias Iniciales

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "next-themes": "^0.3.0",
    "sonner": "^1.7.0",
    "date-fns": "^3.6.0",
    "tanstack/react-query": "^5.56.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0",
    "@testing-library/react": "^16.0.0",
    "vitest": "^2.0.0",
    "playwright": "^1.47.0"
  }
}
```

### Configurar Shadcn/UI

```bash
npx shadcn@latest init
# Seleccionar: Next.js, TypeScript, Tailwind, CSS variables

# Componentes iniciales recomendados
npx shadcn@latest add button card input label sheet 
npx shadcn@latest add tabs dialog dropdown-menu toast
npx shadcn@latest add avatar badge separator skeleton
npx shadcn@latest add table form select textarea
```

---

## 🗄️ Paso 3: Supabase Setup

### Crear Proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) → "New Project"
2. Nombre: `kaizen-project`
3. Password de DB: guardar seguro
4. Región: `us-east-1` (cerca de Vercel)

### Esquema Inicial (Objetos Raíz)

```sql
-- 00_organizations.sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 01_profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  organization_id UUID REFERENCES organizations(id),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 02_projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  methodology TEXT,
  target_entity TEXT,
  country TEXT DEFAULT 'Colombia',
  metadata JSONB DEFAULT '{}',
  version INT DEFAULT 1,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 03_conversations (chat history)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tokens_used INT DEFAULT 0,
  embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 04_documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 05_knowledge_base
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  domain TEXT,
  confidence FLOAT DEFAULT 0.0,
  embedding VECTOR(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 06_agents
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  model TEXT DEFAULT 'gemini-1.5-flash',
  system_prompt TEXT,
  tools JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 07_indicators
CREATE TABLE indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value NUMERIC,
  target NUMERIC,
  unit TEXT,
  formula TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 08_risks
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  probability TEXT,
  impact TEXT,
  mitigation TEXT,
  status TEXT DEFAULT 'identified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_graphql;
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo ven sus proyectos
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (created_by = auth.uid());
```

---

## 🔐 Paso 4: Autenticación

### Supabase Auth + SSR

```typescript
// packages/database/src/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// apps/web/src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### Métodos de Autenticación (Gratuitos)

```typescript
// apps/web/src/app/auth/login/page.tsx
const providers = [
  { name: 'Email & Password', type: 'email', icon: Mail },
  { name: 'Google', type: 'google', icon: Chrome },
  { name: 'GitHub', type: 'github', icon: Github },
]

// Supabase soporta: Email, Google, GitHub, Discord, Twitter(X)
// Todos gratis en free tier
```

---

## 🎨 Paso 5: UI Base

### Layout Principal

```tsx
// apps/web/src/app/(dashboard)/layout.tsx
// Sidebar + Header + Main Content
// Temas: Claro/Oscuro
// Responsive: Mobile-first

// Componentes base creados:
// - SidebarNavigation (proyectos, agentes, documentos)
// - TopBar (búsqueda, notificaciones, perfil)
// - ProjectList (tarjetas de proyecto)
// - ChatInterface (Streaming con AI)
```

### Páginas Iniciales

| Ruta | Propósito | Componentes |
|------|-----------|-------------|
| `/` | Landing Page | Hero, Features, CTA |
| `/login` | Login/Register | Auth form + providers |
| `/dashboard` | Home del usuario | Project list, stats |
| `/dashboard/projects/new` | Nuevo proyecto | Chat + Discovery |
| `/dashboard/projects/[id]` | Proyecto existente | Detalle + chat |
| `/dashboard/documents` | Documentos | Lista + upload |
| `/dashboard/settings` | Configuración | Perfil, organización |

---

## 🔄 Paso 6: CI/CD con GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test

  deploy:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🚀 Paso 7: Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy inicial
vercel --prod

# Configurar variables de entorno en Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# GEMINI_API_KEY=
# OPENAI_API_KEY= (opcional)
# SENTRY_DSN= (opcional)
```

---

## 📊 Paso 8: Monitoreo con Sentry

```bash
# En apps/web
npm install @sentry/nextjs
npx sentry-wizard -i nextjs

# Configurar rate limits en sentry.yaml
```

---

## ✅ Definition of Done — FASE 1

- [ ] App corre en producción (vercel.app o dominio propio)
- [ ] Usuarios pueden registrarse e iniciar sesión
- [ ] Base de datos con todas las tablas creadas
- [ ] RLS configurado y funcional
- [ ] Sidebar + navegación funcionando
- [ ] Tema claro/oscuro operativo
- [ ] CI/CD pasa todas las verificaciones
- [ ] Monitoreo básico activo

---

> **Siguiente fase:** [03_FASE_2_MVP_CORE.md](03_FASE_2_MVP_CORE.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
