# 🚀 GUÍA DE INICIO RÁPIDO — KAIZEN PROJECT'S IA

> **Tiempo estimado:** 30 minutos  
> **Requisitos:** Node.js 20+, Git, cuenta gratuita en Supabase + Google AI Studio

---

## 📋 Prerrequisitos

```bash
# 1. Node.js 20+ 
node --version  # v20.0.0 o superior

# 2. npm 10+
npm --version   # v10.0.0 o superior

# 3. Git
git --version

# 4. Cuentas gratuitas necesarias:
#    - GitHub: https://github.com
#    - Supabase: https://supabase.com (Free tier)
#    - Google AI Studio: https://aistudio.google.com (Gemini API Key)
#    - Vercel: https://vercel.com (Free Hobby plan)
```

---

## 🚀 Paso 1: Clonar e Instalar

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/kaizen-project.git
cd kaizen-project

# Instalar dependencias (monorepo con Turborepo)
npm install

# Construir todos los paquetes
npm run build
```

---

## 🔧 Paso 2: Variables de Entorno

```bash
# Copiar el template de variables de entorno
cp .env.example .env.local
```

```env
# .env.local

# === SUPABASE (gratuito) ===
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key

# === GOOGLE GEMINI (gratuito) ===
GEMINI_API_KEY=AIza...tu-gemini-api-key

# === OPCIONAL: FALLBACK ===
OPENROUTER_API_KEY=sk-or-... (alternativa gratuita)

# === OPCIONAL: MONITOREO ===
NEXT_PUBLIC_SENTRY_DSN=https://... (Sentry free)
NEXT_PUBLIC_POSTHOG_KEY=phc_... (PostHog free)
```

### Obtener Keys Gratuitas

**Supabase:**
1. Ir a [supabase.com](https://supabase.com) → "New Project"
2. Nombre: `kaizen-project`, Password segura
3. En Settings → API: copiar URL + anon key + service role key

**Gemini API:**
1. Ir a [aistudio.google.com](https://aistudio.google.com)
2. "Get API Key" → "Create API Key"
3. Copiar la clave (comienza con `AIza`)

---

## 🗄️ Paso 3: Migraciones de Base de Datos

### Opción A: Supabase Studio (Rápido)

```bash
# 1. Ir a tu proyecto en supabase.com
# 2. SQL Editor → New Query
# 3. Copiar el contenido de apps/web/src/lib/database/schema.sql
# 4. Ejecutar (seleccionar todo y ▶️ Run)
```

### Opción B: Supabase CLI (Recomendado para producción)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase local
supabase init

# Vincular con tu proyecto remoto
supabase link --project-ref tu-project-ref

# Ejecutar migraciones
supabase db push

# Generar tipos de TypeScript automáticamente
supabase gen types typescript --local > packages/database/src/types.gen.ts
```

---

## 💾 Paso 4: Seed de Datos Iniciales

```bash
# Ejecutar seed data (convocatorias, agentes, config)
npm run db:seed
```

```typescript
// packages/database/src/seed.ts
import { createClient } from '@supabase/supabase-js'

async function seed() {
  // Seed agents
  const agents = [
    { name: 'Director Estratégico', role: 'strategic', model: 'gemini-1.5-flash' },
    { name: 'Director Financiero', role: 'financial', model: 'gemini-1.5-flash' },
    { name: 'Director Jurídico', role: 'legal', model: 'gemini-1.5-flash' },
    { name: 'Director Comercial', role: 'commercial', model: 'gemini-1.5-flash' },
    { name: 'Director Investigación', role: 'research', model: 'gemini-1.5-flash' },
    { name: 'Director Convocatorias', role: 'calls', model: 'gemini-1.5-flash' },
    { name: 'Director Riesgos', role: 'risks', model: 'gemini-1.5-flash' },
  ]
  
  // Seed Colombian entities
  const entities = [
    { name: 'Fondo Emprender', slug: 'fondo-emprender', sector: 'Emprendimiento' },
    { name: 'iNNpulsa Colombia', slug: 'innpulsa', sector: 'Innovación' },
    { name: 'MinCiencias', slug: 'minciencias', sector: 'Ciencia y Tecnología' },
  ]
  
  console.log('✅ Seed data inserted')
}

seed()
```

---

## 🏃 Paso 5: Ejecutar Localmente

```bash
# Terminal 1: Desarrollo (Next.js + Turbopack)
npm run dev

# La app estará en: http://localhost:3000

# Terminal 2: Tipos de Supabase (watch mode)
npm run db:types:watch

# Terminal 3: Tests en modo watch
npm run test:watch
```

---

## ✅ Verificar que Todo Funciona

```bash
# 1. TypeScript sin errores
npm run typecheck

# 2. Tests pasan
npm run test

# 3. Linter sin errores
npm run lint

# 4. App corriendo localmente
open http://localhost:3000
```

### Prueba Manual Rápida

```
1. Abrir http://localhost:3000
2. Registrarse con email + contraseña (o Google)
3. Crear un nuevo proyecto → "Mi Primer Proyecto"
4. En el chat, escribir: "Quiero crear un restaurante sostenible en Medellín"
5. Verificar que KAIZEN responde con preguntas inteligentes
6. Responder las preguntas hasta que el proyecto esté completo
7. Exportar a PDF → ¡Proyecto listo! 🎉
```

---

## ☁️ Paso 6: Deploy a Producción

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - GEMINI_API_KEY
```

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm run test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📁 Estructura del Proyecto

```
kaizen-project/
├── apps/
│   ├── web/                    # Next.js App Router
│   │   ├── app/                # Páginas + API routes
│   │   ├── components/         # Componentes React
│   │   └── lib/                # Configuración cliente
│   └── docs/                   # Documentación (Nextra)
├── packages/
│   ├── ui/                     # Componentes compartidos
│   ├── database/               # Schemas + migraciones
│   ├── ai/                     # LLM, embeddings, RAG
│   ├── agents/                 # LangGraph agents
│   ├── knowledge/              # Knowledge engine
│   └── integrations/           # Convocatorias, export
├── tooling/                    # Scripts de automatización
├── .github/workflows/          # CI/CD
└── docs/                       # Plan de construcción (estos MDs)
```

---

## 📚 Comandos Útiles

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build de producción
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint
npm run test         # Vitest
npm run test:e2e     # Playwright (E2E)
npm run db:seed      # Poblar datos iniciales
npm run db:types     # Generar tipos de Supabase
npm run storybook    # Storybook (componentes)
```

---

## 🆘 Solución de Problemas Comunes

| Problema | Solución |
|----------|----------|
| `Supabase: Invalid API key` | Verificar `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` |
| `Gemini: API key not valid` | Regenerar API key en [aistudio.google.com](https://aistudio.google.com) |
| `TypeScript errors` | Ejecutar `npm run typecheck` y corregir tipos |
| `Tests failing` | Verificar que Supabase esté corriendo y accesible |
| `Error: listen EADDRINUSE` | Puerto 3000 ocupado → `npm run dev -- -p 3001` |

---

> **¿Primera vez?** Empieza por [02_FASE_1_FUNDACION.md](02_FASE_1_FUNDACION.md) para entender la arquitectura completa.

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
