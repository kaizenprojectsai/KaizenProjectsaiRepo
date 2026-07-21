# 🔧 CATÁLOGO DE RECURSOS GRATUITOS — KAIZEN PROJECT'S IA

> **Objetivo:** Construir KAIZEN completo sin gastar dinero  
> **Actualizado:** Julio 2026  
> **Total:** $0/mes en recursos cloud + herramientas open source

---

## 📊 Resumen del Stack Gratuito

| Categoría | Tecnología | Free Tier | Límite |
|-----------|-----------|-----------|--------|
| **Hosting** | Vercel | ✅ | 100GB ancho de banda, 6000h build |
| **Hosting** | Cloudflare Pages | ✅ | Sin límite de ancho de banda |
| **Hosting** | Netlify | ✅ | 100GB, 300 min build |
| **DB Principal** | Supabase PostgreSQL | ✅ | 500MB DB, 2GB bandwidth |
| **Vector DB** | Supabase pgvector | ✅ | Incluido en PostgreSQL |
| **Vector DB** | ChromaDB | ✅ | Self-hosted, sin límites |
| **Vector DB** | Qdrant Cloud | ✅ | 1GB free |
| **Auth** | Supabase Auth | ✅ | 50,000 usuarios |
| **Auth** | Clerk | ✅ | 10,000 usuarios |
| **Auth** | NextAuth | ✅ | Open Source, sin límites |
| **Storage** | Supabase Storage | ✅ | 1GB archivos |
| **Storage** | Cloudflare R2 | ✅ | 10GB, sin cargo de salida |
| **Storage** | UploadThing | ✅ | 2GB archivos |
| **LLM** | Google Gemini | ✅ | 60 req/min (Flash), 360 req/día (Pro) |
| **LLM** | OpenRouter | ✅ | Múltiples modelos gratuitos |
| **LLM** | Hugging Face | ✅ | Modelos open source |
| **LLM** | Groq Cloud | ✅ | 30 req/s con Llama/Mixtral |
| **Embeddings** | Gemini Embeddings | ✅ | 1500 req/día |
| **Embeddings** | OpenAI (con Azure) | ✅ | $1 credit free |
| **Search** | Meilisearch | ✅ | Self-hosted |
| **Search** | Typesense | ✅ | Self-hosted |
| **Search** | Supabase Full-Text | ✅ | Incluido |
| **CI/CD** | GitHub Actions | ✅ | 2000 min/mes |
| **CI/CD** | GitLab CI | ✅ | 400 min/mes |
| **Monitoring** | Sentry | ✅ | 5K eventos/mes |
| **Monitoring** | PostHog | ✅ | 1M eventos/mes |
| **Monitoring** | Grafana | ✅ | Self-hosted |
| **Email** | Resend | ✅ | 100 emails/día |
| **Email** | SendGrid | ✅ | 100 emails/día |
| **Email** | Loops | ✅ | 100 emails/día |
| **CDN** | Cloudflare | ✅ | Ilimitado |
| **DNS** | Cloudflare | ✅ | Ilimitado |
| **SSL** | Cloudflare / Let's Encrypt | ✅ | Ilimitado |
| **Diagrams** | Mermaid | ✅ | Open Source |
| **Charts** | Recharts | ✅ | Open Source |
| **UI** | Shadcn/UI | ✅ | Open Source |
| **UI** | Radix UI | ✅ | Open Source |
| **PDF** | @react-pdf/renderer | ✅ | Open Source |
| **DOCX** | docx | ✅ | Open Source |
| **Excel** | ExcelJS | ✅ | Open Source |
| **AI Agents** | LangGraph | ✅ | Open Source |
| **AI Agents** | CrewAI | ✅ | Open Source |
| **AI Agents** | AutoGen | ✅ | Open Source |
| **Vector Store** | LangChain | ✅ | Open Source |
| **Web Scraping** | Firecrawl | ✅ | 500 créditos/mes |
| **Forms** | React Hook Form | ✅ | Open Source |
| **Validation** | Zod | ✅ | Open Source |
| **Charts** | Tremor | ✅ | Open Source |
| **Maps** | MapLibre | ✅ | Open Source |
| **Maps** | Leaflet | ✅ | Open Source |

---

## 🤖 LLMs y Modelos de IA Gratuitos

### Google Gemini (Recomendado)

```bash
# API Key gratuita
# 1. Ve a https://aistudio.google.com/
# 2. Haz clic en "Get API Key"
# 3. Crea una API Key

# Modelos disponibles:
gemini-1.5-flash    # GRATIS: 60 requests/minuto
gemini-1.5-pro      # GRATIS: 2 req/min (limitado)
gemini-2.0-flash    # GRATIS (nuevo, más rápido)
gemini-2.0-flash-lite # GRATIS (optimizado)
```

### OpenRouter (Multi-modelo gratuito)

```bash
# API Key: https://openrouter.ai/keys
# Proporciona acceso a MÚLTIPLES modelos gratuitos

# Modelos gratuitos disponibles:
google/gemini-2.0-flash-lite-preview-02-05:free
meta-llama/llama-3.2-3b-instruct:free
microsoft/phi-3-mini-128k-instruct:free
mistralai/mistral-7b-instruct:free
```

### Groq Cloud (Ultra-rápido)

```bash
# API Key: https://console.groq.com/keys
# Velocidad increíble: 30 requests/segundo

# Modelos gratuitos:
mixtral-8x7b-32768
llama3-70b-8192
llama3-8b-8192
gemma2-9b-it
whisper-large-v3 (speech-to-text)
```

### Hugging Face (Open Source)

```bash
# API Key: https://huggingface.co/settings/tokens
# Modelos open source gratuitos

# Modelos recomendados:
mistralai/Mistral-7B-Instruct-v0.3
meta-llama/Llama-3.2-3B-Instruct
microsoft/Phi-3-mini-4k-instruct
google/gemma-2-9b-it
```

---

## 🗄️ Bases de Datos Gratuitas

### Supabase (PostgreSQL) — RECOMENDADO

| Feature | Free Tier |
|---------|-----------|
| Base de datos PostgreSQL | 500 MB |
| API REST Auto-generada | ✅ |
| Autenticación | 50,000 usuarios |
| Storage | 1 GB |
| Edge Functions | 500,000 requests/mes |
| Realtime | 200 concurrent |
| pgvector | ✅ incluido |
| pg_graphql | ✅ incluido |

### Neon (Serverless PostgreSQL)

| Feature | Free Tier |
|---------|-----------|
| Almacenamiento | 500 MB |
| Branching | Ilimitado (solo proyectos) |
| Compute | 100h/mes |

### Turso (SQLite Edge)

| Feature | Free Tier |
|---------|-----------|
| Almacenamiento | 9 GB |
| Bases de datos | 500 |
| Location | Multiregión |

### Upstash (Redis + Vector)

| Feature | Free Tier |
|---------|-----------|
| Redis | 10,000 comandos/día |
| Vector | 10,000 queries/día |
| Kafka | 10,000 mensajes/día |

---

## 🎨 UI y Componentes Gratuitos

### Shadcn/UI (Base del Frontend)
```bash
# Colección de componentes React reutilizables
# Basado en Radix UI + Tailwind CSS
npx shadcn@latest add button card input label
npx shadcn@latest add sheet tabs dialog dropdown-menu
npx shadcn@latest add avatar badge separator skeleton
npx shadcn@latest add table form select textarea
npx shadcn@latest add toast popover tooltip
npx shadcn@latest add command (Command palette / CMD+K)
```

### Iconos
- **Lucide** — 1000+ iconos open source
- **Heroicons** — Iconos SVG de Tailwind
- **React Icons** — Todos los sets en uno

### Animaciones
- **Framer Motion** — Animaciones React (free)
- **Motion** (de Framer) — Nueva versión gratuita
- **Tailwind Animate** — Animaciones CSS puras
- **AutoAnimate** — Animaciones automáticas

---

## 📄 Generación de Documentos

### PDF
```bash
npm install @react-pdf/renderer
# React components → PDF profesional
# Soporta: tablas, imágenes, gráficos, encabezados
```

### Word (DOCX)
```bash
npm install docx
# Create Word documents programmatically
# Soporta: estilos, tablas, imágenes, headers
```

### Excel (XLSX)
```bash
npm install exceljs
# Create Excel files con fórmulas, estilos, charts
```

### PowerPoint
```bash
npm install pptxgenjs
# Create presentations con slides, charts, tables
```

### Markdown
```bash
npm install react-markdown rehype-highlight
# Renderizar y exportar Markdown con sintaxis highlight
```

---

## 🤖 AI Agents Frameworks (Gratuitos)

### LangGraph (RECOMENDADO)
```bash
npm install @langchain/core @langchain/langgraph @langchain/google-genai
# Framework de grafos para agentes
# Soporta: ciclos, paralelismo, streaming, persistencia
```

### CrewAI
```bash
pip install crewai
# O con npm: npx crewai
# Multi-agente con roles y tareas
# Ideal para orquestación de especialistas
```

### AutoGen (Microsoft)
```bash
pip install pyautogen
# Multi-agent conversations
# Soporta: código ejecución, tool use, human-in-loop
```

---

## 🛠️ Herramientas de Desarrollo

### TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### ESLint + Prettier
```bash
npm install -D eslint @typescript-eslint/parser prettier
npm install -D eslint-config-prettier eslint-plugin-react
npm install -D eslint-plugin-tailwindcss prettier-plugin-tailwindcss
```

### Husky + Lint-Staged
```bash
npm install -D husky lint-staged
npx husky init

# .husky/pre-commit
npx lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

### Testing
```bash
# Unit tests
npm install -D vitest @testing-library/react @testing-library/jest-dom

# E2E tests
npm install -D @playwright/test
npx playwright install

# Component testing
npm install -D @storybook/react storybook
npx storybook init
```

---

## 📊 Monitoreo y Analytics

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx sentry-wizard -i nextjs
# Free: 5,000 eventos/mes
```

### PostHog (Product Analytics)
```bash
npm install posthog-js
# Free: 1,000,000 eventos/mes
# Incluye: feature flags, session recording, a/b testing
```

### Grafana Faro (Observability)
```bash
npm install @grafana/faro-web-sdk @grafana/faro-react
# Open source, self-hosted
# RUM, logs, traces, metrics
```

---

## 📝 Consejos para Maximizar Recursos Gratuitos

### 1. Estrategia de LLM
```
Uso diario típico: 500-2000 requests

Google Gemini Flash: 
  60 req/min → suficiente para ~5 usuarios concurrentes
  Batch requests cuando sea posible
  
OpenRouter:
  Usar como fallback cuando Gemini tenga límites
  Rotar entre modelos gratuitos

Caching:
  Cachear respuestas frecuentes en Redis Upstash
  Similar questions → misma respuesta
  Reduce costos de API significativamente
```

### 2. Optimización de Base de Datos
```
Supabase Free (500MB):
  - Datos esenciales: ~100MB (proyectos, usuarios, config)
  - Embeddings + chunks: ~200MB (comprimido)
  - Metadata: ~50MB
  → 350MB total, dentro del límite

Para escalar:
  - Migrar embeddings a ChromaDB (self-hosted, gratis)
  - Usar Cloudflare R2 para documentos grandes
  - Cachear consultas frecuentes en memoria
```

### 3. Deploy Estratégico
```
Vercel (Frontend + API Routes):
  - Proyecto Next.js principal → Vercel
  - Edge Functions para baja latencia
  
Cloudflare (Assets + CDN):
  - Archivos estáticos → Cloudflare Pages
  - Documentos → R2 Storage
  - DNS + CDN → Cloudflare

Backend Pesado:
  - Supabase Edge Functions para procesos serverless
  - GitHub Actions para procesos batch (diarios)
```

### 4. Evitar Costos Inesperados
```
✅ Monitorear uso de APIs con dashboard
✅ Rate limiting en endpoints públicos
✅ Cachear respuestas de LLM
✅ Comprimir imágenes y documentos
✅ Usar lazy loading en frontend
✅ TTL corto para datos temporales
✅ Logs de errores para detectar problemas temprano
```

---

> **Siguiente documento:** [08_ROADMAP.md](08_ROADMAP.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
