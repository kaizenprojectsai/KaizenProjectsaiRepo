# 📐 ARCHITECTURE DECISION RECORDS (ADR) — KAIZEN PROJECT'S IA

> **Propósito:** Documentar las decisiones arquitectónicas clave y su fundamentación  
> **Formato:** ADR clásico (Contexto → Decisión → Consecuencias)

---

## 📋 Índice de Decisiones

| # | Decisión | Estado | Fecha |
|---|----------|--------|-------|
| 1 | Monorepo con Turborepo | ✅ Aceptada | Julio 2026 |
| 2 | Supabase como Backend Principal | ✅ Aceptada | Julio 2026 |
| 3 | Google Gemini como LLM Principal | ✅ Aceptada | Julio 2026 |
| 4 | Next.js App Router + API Routes | ✅ Aceptada | Julio 2026 |
| 5 | LangGraph para Orquestación Multi-Agente | ✅ Aceptada | Julio 2026 |
| 6 | pgvector como Vector Database | ✅ Aceptada | Julio 2026 |
| 7 | Shadcn/UI + Radix como Base de UI | ✅ Aceptada | Julio 2026 |
| 8 | Tailwind CSS como Framework de Estilos | ✅ Aceptada | Julio 2026 |
| 9 | TypeScript Estricto como Lenguaje | ✅ Aceptada | Julio 2026 |
| 10 | PostHog para Product Analytics | ⏳ Pendiente | — |
| 11 | Serverless-first Deployment | ✅ Aceptada | Julio 2026 |
| 12 | Zod para Validación de Schemas | ✅ Aceptada | Julio 2026 |
| **13** | **Decisión de No Migrar a Angular** | **✅ Aceptada** | **Agosto 2026** |

---

## 📝 ADR-001: Monorepo con Turborepo

**Estado:** ✅ Aceptada

### Contexto
KAIZEN tiene múltiples componentes que comparten código: UI components, tipos, utilidades de IA, schemas de base de datos, agentes. Necesitamos una forma eficiente de gestionar dependencias entre paquetes, compartir configuraciones de TypeScript/ESLint y ejecutar builds optimizados.

### Decisión
Usar **Turborepo** como orquestador de monorepo con npm workspaces.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Turborepo** ✅ | Cache inteligente, paralelismo, UI de dashboard | Menos plugins que Nx |
| Nx | Más plugins, generadores de código | Más complejo, overkill para nuestro tamaño |
| pnpm workspaces | Simple, nativo | Sin cache, sin paralelismo |
| Lerna | Maduro | Mantenimiento inactivo recientemente |

### Consecuencias
- **Positivas:** Builds 10x más rápidos con cache, código compartido eficiente, configuración centralizada
- **Negativas:** Curva de aprendizaje inicial, dependencia de una herramienta más
- **Riesgo:** Si Turborepo deja de mantenerse, migrar a Nx sería costoso

---

## 📝 ADR-002: Supabase como Backend Principal

**Estado:** ✅ Aceptada

### Contexto
Necesitamos BaaS (Backend as a Service) gratuito que incluya: PostgreSQL, autenticación, storage, APIs REST automáticas, y soporte para vectores (pgvector).

### Decisión
Usar **Supabase** como backend principal.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Supabase** ✅ | PostgreSQL + Auth + Storage + pgvector + Realtime | 500MB límite free |
| Firebase | Más conocido, mejor tiempo real | Firestore no es SQL, vendor lock-in |
| Clerk | Excelente auth | Solo auth, necesitas DB aparte |
| Convex | Tiempo real nativo | Relativamente nuevo, menos maduro |
| Neon | Serverless PostgreSQL | Sin auth, sin storage |

### Consecuencias
- **Positivas:** Stack completo con una sola herramienta, pgvector incluido sin costo extra, 50K usuarios auth gratis, APIs auto-generadas
- **Negativas:** Límite de 500MB puede requerir migración a plan pago ($25/mes), vendor lock-in parcial
- **Mitigación:** Usar Prisma/Drizzle como ORM abstracto para poder migrar a otra DB si es necesario

---

## 📝 ADR-003: Google Gemini como LLM Principal

**Estado:** ✅ Aceptada

### Contexto
Necesitamos un LLM para el chat conversacional, generación de contenido, agentes, embeddings y análisis de documentos. Debe ser gratuito o de muy bajo costo.

### Decisión
Usar **Google Gemini 1.5 Flash** como modelo principal y mantener OpenRouter como fallback.

### Opciones Consideradas

| Opción | Costo Free Tier | Ventajas | Desventajas |
|--------|----------------|----------|-------------|
| **Gemini Flash** ✅ | 60 req/min gratis | Mejor free tier, 1M context window, bueno en español | Sin fine-tuning gratis |
| OpenAI GPT-4o-mini | $0.15/M tokens | Más preciso, ecosistema grande | No tiene free tier real |
| OpenRouter (multi-modelo) | Modelos gratis rotativos | Acceso a muchos modelos | No determinista (modelos cambian) |
| Groq | 30 req/s gratis | Ultra-rápido, buenos modelos open source | Modelos más pequeños (3B-8B) |
| Claude (Anthropic) | Sin free tier | Excelente razonamiento | Costoso incluso para pruebas |

### Consecuencias
- **Positivas:** 60 req/min gratis = 86,400 requests/día, suficiente para MVP, 1M tokens de contexto perfecto para documentos grandes
- **Negativas:** Dependencia de Google, calidad inferior a GPT-4 en tareas complejas, rate limits pueden ser ajustados en horas pico
- **Mitigación:** Capa de abstracción de LLM (Strategy Pattern), OpenRouter como fallback, caching de respuestas frecuentes

---

## 📝 ADR-004: Next.js App Router + API Routes

**Estado:** ✅ Aceptada

### Contexto
Necesitamos un framework full-stack que maneje frontend, API routes y serverless deployment.

### Decisión
Usar **Next.js 14+ con App Router y API Routes**.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Next.js** ✅ | Full-stack, serverless, React Server Components | Bundle size, complejidad en SSR |
| Remix | Excelente en forms, progressive enhancement | Menos ecosistema |
| SvelteKit | Rendimiento, menos código | Menos librerías, comunidad más pequeña |
| T3 Stack (tRPC) | Typesafe end-to-end | Overhead de tRPC para nuestro caso |

### Consecuencias
- **Positivas:** Frontend y backend en un solo proyecto, deploy optimizado en Vercel (gratis), RSC para rendimiento, API Routes para serverless
- **Negativas:** API Routes tienen timeout de 10s en Vercel Hobby (procesos largos requieren Edge Functions externas)

---

## 📝 ADR-005: LangGraph para Multi-Agente

**Estado:** ✅ Aceptada

### Contexto
Necesitamos orquestar múltiples agentes de IA que colaboren secuencial y paralelamente, con estado compartido, ciclos y persistencia.

### Decisión
Usar **LangGraph** (LangChain) para la orquestación multi-agente.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **LangGraph** ✅ | Grafos de estado, ciclos, paralelismo, integración con LangChain | Relativamente nuevo, API cambia |
| CrewAI | API simple, roles + tareas | Limitado en flujos complejos, sin ciclos |
| AutoGen (Microsoft) | Conversaciones entre agentes | Setup complejo, Python-first |
| Semantic Kernel (Microsoft) | Empresarial, .NET + Python | Ecosistema pequeño en JS |

### Consecuencias
- **Positivas:** Control granular sobre flujo de agentes, soporte para ciclos (un agente puede llamar a otro varias veces), integración nativa con Gemini vía LangChain
- **Negativas:** API inestable (LangGraph está en versión temprana), abstracción adicional puede complicar debugging, requiere entender grafos de estado

---

## 📝 ADR-006: pgvector como Vector Database

**Estado:** ✅ Aceptada

### Contexto
Necesitamos almacenar embeddings para búsqueda semántica (RAG). Preferiblemente sin infraestructura adicional.

### Decisión
Usar **pgvector** (extensión de PostgreSQL) dentro de Supabase.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **pgvector** ✅ | Sin infraestructura extra, transaccional, backup automático | Rendimiento inferior a dedicadas a gran escala |
| Pinecone | Rendimiento superior, managed | Sin free tier real (paga después del trial) |
| ChromaDB | Open source, simple | Infraestructura separada, menos features |
| Qdrant Cloud | 1GB gratis, rendimiento | Infraestructura separada |
| Weaviate | Schema automático, híbrido | Complejo, overkill para MVP |

### Consecuencias
- **Positivas:** Cero infraestructura extra, datos consistentes (misma DB que proyectos), búsqueda híbrida (vector + texto) en una query
- **Negativas:** IVFFlat index es menos preciso que HNSW, rendimiento degrada con >1M vectores (mitigación: migrar a Qdrant si es necesario)

---

## 📝 ADR-007: Shadcn/UI + Radix como UI Base

**Estado:** ✅ Aceptada

### Contexto
Necesitamos componentes de UI accesibles, customizables y con buen diseño por defecto.

### Decisión
Usar **Shadcn/UI** (basado en Radix UI + Tailwind CSS).

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Shadcn/UI** ✅ | Código en tu repo (no dependencia), altamente customizable, accesible | Más setup inicial, no es un componente "instalado" |
| Material UI | Muchos componentes, documentación excelente | Pesado, difícil de customizar, look Material |
| Chakra UI | Accesible, buen DX | Menos componentes que MUI, mantenimiento dudoso |
| Ant Design | Completo, empresarial | Pesado, chino-centric |
| Radix UI puro | Accesible, primitivas | Muy bajo nivel, requiere mucho trabajo |

### Consecuencias
- **Positivas:** Componentes en tu código (fácil customizar), accesibilidad garantizada (Radix), tema Tailwind nativo, bundle pequeño (solo importas lo que usas)
- **Negativas:** Tienes que mantener el código de los componentes, no hay "upgrade" automático

---

## 📝 ADR-008: Tailwind CSS

**Estado:** ✅ Aceptada

### Contexto
Framework de estilos para el frontend.

### Decisión
Usar **Tailwind CSS v3+** con clases utilitarias.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Tailwind** ✅ | Rápido, consistente, tree-shaking nativo, ecosistema grande | HTML verboso, curva de aprendizaje |
| CSS Modules | Nativo, sin dependencias | Sin diseño system, inconsistente |
| Styled Components | Dinámicos, JS-based | Bundle grande, menos performance |
| Panda CSS | Typesafe, RSC compatible | Nuevo, menos comunidad |

### Consecuencias
- **Positivas:** Desarrollo rápido, diseño consistente, bundle pequeño (purga CSS no usado), integración perfecta con Shadcn/UI
- **Negativas:** Clases largas en JSX, requiere disciplina para no crear estilos inconsistentes

---

## 📝 ADR-009: TypeScript Estricto

**Estado:** ✅ Aceptada

### Contexto
Lenguaje para todo el proyecto.

### Decisión
Usar **TypeScript con modo estricto** en todo el código.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **TypeScript Strict** ✅ | Tipado fuerte, menos bugs, mejor DX, auto-documentado | Más tiempo de desarrollo inicial |
| JavaScript | Rápido al inicio | Bugs en producción, mal DX en equipo |
| TypeScript (no strict) | Balance | Falsa seguridad |

### Consecuencias
- **Positivas:** Cero bugs de tipo en producción, mejor autocompletado en IDE, documentación viva, refactoring seguro
- **Negativas:** Más código boilerplate (tipos, interfaces), curva de aprendizaje para el equipo

---

## 📝 ADR-010: Serverless-first Deployment

**Estado:** ✅ Aceptada

### Contexto
Estrategia de deployment para maximizar el free tier y escalar desde 0.

### Decisión
Arquitectura **Serverless-first**: Vercel (Edge + Serverless Functions) + Supabase (Managed DB) + Cloudflare (CDN + R2).

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Serverless** ✅ | Paga por uso, escala a 0, sin mantenimiento | Timeout 10s (Vercel Hobby), cold starts |
| VPS (DigitalOcean) | Control total, $4/mes | Mantenimiento, no escala a 0 |
| Docker + K8s | Portable, escalable | Overhead operacional enorme |
| AWS EC2 | Máximo control | Complejidad, costos escondidos |

### Consecuencias
- **Positivas:** $0/mes en desarrollo, escala automática, sin DevOps dedicado
- **Negativas:** Timeout de 10s en serverless functions (procesos largos como generación de PDF complejos pueden fallar), cold starts ocasionales

---

## 📝 ADR-011: Zod para Validación

**Estado:** ✅ Aceptada

### Contexto
Necesitamos validación de schemas en runtime (APIs, forms, configuraciones).

### Decisión
Usar **Zod** para validación de schemas.

### Opciones Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Zod** ✅ | Typescript-first, inferencia de tipos, composición | Documentación mejorable |
| Yup | Maduro, buena docs | Menos integración con TS |
| Joi | Muy maduro | No Typescript nativo |
| Valibot | Modular, pequeño | Nuevo, menos adopción |

### Consecuencias
- **Positivas:** Types inferidos automáticamente, validación en frontend y backend con el mismo schema, composición fácil
- **Negativas:** Una dependencia más, schemas anidados pueden ser verbosos

---

## 📝 Cómo Proponer un Nuevo ADR

```markdown
# ADR-XXX: [Título de la Decisión]

**Estado:** ⏳ Propuesta / ✅ Aceptada / ❌ Rechazada

### Contexto
[Descripción del problema y contexto]

### Decisión
[Decisión tomada]

### Opciones Consideradas
| Opción | Ventajas | Desventajas |
|--------|----------|-------------|

### Consecuencias
- **Positivas:**
- **Negativas:**
- **Riesgos:**

### Referencias
- [Enlaces a documentación relevante]
```


---

## 📝 ADR-013: Decisión de No Migrar a Angular

**Estado:** ✅ Aceptada  
**Fecha:** Agosto 2026

### Contexto
El equipo evaluó la posibilidad de migrar el frontend de KAIZEN de Next.js (React) a Angular, motivado por las ventajas arquitectónicas que ofrece Angular para proyectos empresariales (inyección de dependencias, modularidad forzada, TypeScript obligatorio, RxJS nativo).

Se realizó un análisis de viabilidad considerando:
- Arquitectura actual del proyecto (monorepo + serverless + SSR/SSG)
- Dependencias del ecosistema AI/LLM (Vercel AI SDK, LangChain, streaming)
- Costos de infraestructura (Vercel Free Tier vs hosting alternativo para Angular)
- Esfuerzo de migración estimado (3-6 meses)
- Impacto en el roadmap de 24 semanas
- Beneficios reales vs pérdidas técnicas

### Decisión
**No migrar a Angular.** Mantener Next.js como framework principal.

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Next.js (Actual) ✅** | Serverless nativo, Vercel AI SDK, streaming, ecosistema AI optimizado, $0/mes | Arquitectura menos rígida (requiere disciplina) |
| Angular (Migrar) | DI nativa, módulos, RxJS, arquitectura forzada, ideal equipos grandes | Pierdes API Routes integradas, SSR complejo (Angular Universal), ecosistema AI pobre, bundles pesados (~200-400KB), migración 3-6 meses |
| SvelteKit (Alternativa) | Rendimiento superior, menos código | Ecosistema pequeño, menor soporte AI/LLM |

### Análisis Detallado

#### 1. Ecosistema AI/LLM (Factor Crítico)
KAIZEN depende de:
- **Vercel AI SDK (`@ai-sdk/react`)**: No tiene SDK para Angular. Requeriría integración manual compleja.
- **Streaming de respuestas**: En Next.js es trivial con React Server Components + Suspense. En Angular requiere RxJS avanzado + Change Detection manual.
- **LangChain + LangGraph**: Las integraciones con React/Next.js son superiores y más documentadas.
- **90%+ de startups AI/LLM eligen Next.js/React**: Angular tiene tracción mínima en este espacio.

#### 2. Infraestructura y Costos
| Aspecto | Next.js (Vercel Free) | Angular (Alternativa) |
|---------|----------------------|----------------------|
| Cold start | ~50ms (Edge) | ~200-400ms (necesita servidor) |
| Bundle inicial | ~80-120KB | ~200-400KB mínimo |
| Hosting gratis | Vercel (optimizado) | Firebase/AWS (configuración extra) |
| SSR | ✅ Nativo (Server Components) | ❌ Requiere Angular Universal |
| ISR (Static Regeneration) | ✅ Nativo | ❌ No disponible |
| **Costo mensual** | **$0** | **$0-$50** |

#### 3. Dependencias Afectadas
| Dependencia Actual | Alternativa en Angular | Esfuerzo de Migración |
|-------------------|----------------------|-----------------------|
| Shadcn/UI + Radix | Angular Material / PrimeNG | 🔴 Alto (reescribir todos los componentes) |
| `@ai-sdk/react` | No hay equivalente nativo | 🔴 Muy alto (integración manual con streams) |
| `@supabase/ssr` | `@supabase/supabase-js` | ⚠️ Medio (cambiar lógica SSR) |
| `next/navigation` | `@angular/router` | ⚠️ Alto (toda la navegación cambia) |
| `@react-pdf/renderer` | pdfmake / jsPDF | ⚠️ Medio |
| Turborepo | Nx (sí funciona con Angular) | ✅ Bajo |
| Tailwind CSS | Tailwind (sí funciona) | ✅ Bajo |

#### 4. Impacto en Roadmap
- **Tiempo de migración estimado:** 3-6 meses
- **Costo de oportunidad:** Durante 3-6 meses no se construirían nuevas features
- **Riesgo:** Posible introducción de bugs durante la migración de un sistema complejo multi-agente

### Consecuencias

**Positivas (de mantener Next.js):**
- ✅ Sin interrupción del roadmap de 24 semanas
- ✅ Aprovechamiento del ecosistema AI/LLM optimizado para React
- ✅ Costo $0/mes mantenido en Vercel
- ✅ Streaming y SSR nativos sin configuración adicional
- ✅ Menor bundle size → mejor rendimiento percibido

**Negativas (de no migrar):**
- ❌ Arquitectura menos estricta — mitigable con Clean Architecture + ESLint + ADRs
- ❌ Sin inyección de dependencias nativa — mitigable con Context API + InversifyJS si es necesario
- ❌ Sin RxJS nativo — mitigable con Zustand/Jotai + Streams API

**Riesgos y Mitigaciones:**
| Riesgo | Mitigación |
|--------|-----------|
| Código inconsistente en equipo grande | Clean Architecture en `packages/`, ESLint estricto, Husky, Code Review obligatorio |
| Falta de testing estructurado | Vitest + Testing Library + Playwright + LLM Eval (ver 10_TESTING_STRATEGY.md) |
| Entscheidungsmüdigkeit (fatiga de decisiones) | ADRs documentados + Pull Request templates + Decision Log |

### Referencias
- [01_PLAN_MAESTRO.md#7](01_PLAN_MAESTRO.md) — Decisión Arquitectónica: Next.js vs Angular
- [ADR-004](12_ADR.md#adr-004-nextjs-app-router--api-routes) — Next.js App Router + API Routes
- [ADR-009](12_ADR.md#adr-009-typescript-estricto) — TypeScript Estricto
- [ADR-011](12_ADR.md#adr-011-zod-para-validación) — Zod para Validación
- [10_TESTING_STRATEGY.md](10_TESTING_STRATEGY.md) — Estrategia de Testing
- [07_RECURSOS_GRATUITOS.md](07_RECURSOS_GRATUITOS.md) — Catálogo de Recursos Gratuitos
