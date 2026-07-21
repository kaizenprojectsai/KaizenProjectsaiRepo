dame  d# 🏗️ PLAN MAESTRO — KAIZEN PROJECT'S IA

> **"Transformar una idea desordenada en un proyecto técnicamente sólido, financieramente viable y listo para presentar."**

---

## 1. 🎯 Visión General

**KAIZEN PROJECT'S IA** es una plataforma inteligente que democratiza el acceso a la formulación profesional de proyectos. Utiliza Inteligencia Artificial, agentes especializados y una base de conocimiento exhaustiva para guiar a emprendedores, consultores y organizaciones desde una idea hasta un expediente completo listo para convocatorias, financiamiento o presentación.

### Filosofía Central
- **La verdad antes que la velocidad** — La IA nunca inventa información
- **Toda afirmación tiene respaldo** — Evidencias verificables
- **Nada se elimina, todo evoluciona** — Versionado completo
- **Toda decisión debe explicarse** — Trazabilidad absoluta

---

## 2. 🏛️ Arquitectura Conceptual

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                       │
│          Next.js + Tailwind + Shadcn UI + Stream Chat         │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ORQUESTACIÓN                       │
│         LangGraph / CrewAI — Sistema Multi-Agente             │
│         ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│         │Agente    │ │Agente    │ │Agente    │              │
│         │Financiero│ │Jurídico  │ │Estratég.│              │
│         └──────────┘ └──────────┘ └──────────┘              │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE CONOCIMIENTO                       │
│    RAG + Knowledge Graph + Embeddings + Memoria              │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│    │Supabase  │ │pgvector  │ │Chroma DB │                   │
│    │PostgreSQL│ │Vectors   │ │(caché)   │                   │
│    └──────────┘ └──────────┘ └──────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE INFRAESTRUCTURA                    │
│    Vercel + Supabase + GitHub Actions + Cloudflare            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 📦 Las 5 Fases de Construcción

### **FASE 1: Fundación** (Semanas 1-2)
> Setup completo de infraestructura gratuita

| Componente | Tecnología | Status |
|------------|-----------|--------|
| Repositorio | GitHub | ✅ |
| Frontend Base | Next.js + Tailwind | ✅ |
| Base de Datos | Supabase PostgreSQL | ✅ |
| Autenticación | Supabase Auth | ✅ |
| CI/CD | GitHub Actions | ✅ |
| Hosting | Vercel (Preview) | ✅ |
| UI Componentes | Shadcn/UI + Radix | ✅ |
| Monorepo | Turborepo | ✅ |

**Entregable:** App base corriendo en producción con auth y DB

---

### **FASE 2: MVP Core** (Semanas 3-6)
> El corazón: Kaizen Discovery Engine (KDE)

| Componente | Descripción |
|------------|-------------|
| Chat Inteligente | Interfaz conversacional con streaming |
| Discovery Engine | Motor de preguntas adaptativas |
| Gestor de Proyectos | CRUD + versionado de expedientes |
| Exportación Básica | PDF, Word, Markdown |
| Plantillas Base | Canvas, Marco Lógico, PMBOK |
| LLM Integration | Google Gemini API (gratuito) |

**Entregable:** Usuario puede conversar con KAIZEN y obtener un proyecto estructurado

---

### **FASE 3: Knowledge Engine** (Semanas 7-10)
> La memoria y conocimiento de la organización

| Componente | Tecnología |
|------------|-----------|
| RAG System | LangChain + pgvector |
| Document Ingestion | PDF, DOCX, MD, HTML |
| Knowledge Graph | PostgreSQL + relaciones |
| Embeddings | Gemini Embeddings API |
| Búsqueda Híbrida | Vector + Full-text search |
| Memoria Organizacional | Proyectos anteriores → aprendizaje |
| Clasificación Automática | IA + reglas |

**Entregable:** KAIZEN recuerda proyectos anteriores y aprende de ellos

---

### **FASE 4: Sistema Multi-Agente** (Semanas 11-16)
> La organización digital

| Agente | Rol | Depende de |
|--------|-----|-----------|
| Director Estratégico | Convierte ideas en estrategias | FASE 2 |
| Director Financiero | Análisis VAN, TIR, flujo de caja | FASE 3 |
| Director Jurídico | Normativa, cumplimiento | FASE 3 |
| Director Comercial | Estudio de mercado, buyer persona | FASE 3 |
| Director de Convocatorias | Matching con oportunidades | FASE 3 |
| Director de Riesgos | ISO 31000, matriz de riesgos | FASE 3 |
| Director de Investigación | Estado del arte, marco teórico | FASE 3 |

**Entregable:** Equipo de 8+ agentes colaborando para producir proyectos completos

---

### **FASE 5: Integraciones & Marketplace** (Semanas 17-24)
> El ecosistema completo

| Integración | Propósito |
|-------------|-----------|
| Convocatorias Colombia | Fondo Emprender, iNNpulsa, MinCiencias |
| Formatos Oficiales | MGA, Formatos SENA, DNP |
| Exportación Avanzada | PDF profesional, Excel, PPT |
| Marketplace de Skills | Comunidad + plugins |
| APIs Públicas | REST API para terceros |
| Internacionalización | Múltiples países y monedas |
| Dashboard Analítico | KPIs, métricas, predicciones |

**Entregable:** Plataforma completa con ecosistema de extensiones

---

## 4. 🧠 Los 24 Objetos Raíz del Sistema

```
Organization → Workspace → Objective → Initiative → Project
→ Methodology → Knowledge → Document → Evidence → Decision
→ Conversation → Event → Workflow → Task → Agent → Skill
→ Tool → Template → Indicator → Risk → Opportunity
→ Resource → Integration → User
```

Todo el software se construye sobre estos 24 objetos. Cada uno tiene:
- ✅ Versionado
- ✅ Auditoría
- ✅ Embeddings
- ✅ API
- ✅ Relaciones

---

## 5. 📐 Principios de Desarrollo

1. **API-First** — Todo es una API
2. **TypeScript Nativo** — Tipado extremo a extremo
3. **Serverless Primero** — Escalar desde 0 sin costo
4. **Open Source** — Código abierto, comunidad primero
5. **Privacidad por Diseño** — Datos del usuario siempre protegidos
6. **Offline First** — Resiliencia en la experiencia
7. **Testing Continuo** — CI/CD con tests automáticos

---

## 6. 💰 Presupuesto Mensual (Free Tier)

| Servicio | Costo | Límite Free |
|----------|-------|-------------|
| Vercel | $0 | 100GB ancho de banda, 6000 build hours |
| Supabase | $0 | 500MB DB, 2GB bandwidth, 50K auth users |
| GitHub | $0 | Repos ilimitados, 2000 CI min/mes |
| Google Gemini | $0 | 60 requests/min (1.5 Flash) |
| Cloudflare | $0 | CDN ilimitado, R2 10GB |
| Sentry | $0 | 5K eventos/mes |
| Meilisearch | $0 | Self-hosted (2GB RAM) |
| **Total** | **$0/mes** | |

---

## 7. 🏆 Decisión Arquitectónica: Next.js vs Angular

> **✅ Decisión:** Next.js es el framework correcto para KAIZEN. **No migrar a Angular.**

### Por qué Next.js gana para KAIZEN

| Factor | Next.js (Actual) | Angular | Veredicto |
|--------|------------------|---------|-----------|
| **Serverless + API Routes** | ✅ Nativo con Vercel | ❌ Requiere backend separado | 🏆 Next.js |
| **Ecosistema AI/LLM** | ✅ Vercel AI SDK, LangChain optimizado | ❌ Sin SDK equivalente | 🏆 Next.js |
| **Streaming en tiempo real** | ✅ React Server Components + Suspense | ⚠️ RxJS complejo | 🏆 Next.js |
| **Costo $0/mes** | ✅ Vercel Free optimizado para Next.js | ⚠️ Firebase u otro hosting adicional | 🏆 Next.js |
| **Bundle inicial** | ✅ ~80-120KB | ❌ ~200-400KB | 🏆 Next.js |
| **Arquitectura estructurada** | ⚠️ Flexible (requiere disciplina) | ✅ Forzada (DI, módulos) | 🏆 Angular |
| **Escalabilidad equipos grandes** | ⚠️ Posible con Clean Architecture | ✅ Nativa | 🏆 Angular |

### Recomendación: Mejorar Next.js (no migrar)

| En lugar de migrar a Angular... | Mejora en Next.js |
|-------------------------------|-------------------|
| Arquitectura más rígida | ✅ Clean Architecture en `packages/` + ESLint estricto + Husky |
| Tipado fuerte | ✅ TypeScript strict: true + Zod runtime validation |
| Testing robusto | ✅ Vitest + Testing Library + Playwright + LLM Eval |
| Estado global | ✅ Zustand / Jotai (más ligeros que RxJS) |
| Estructura consistente | ✅ ADRs + Code Review + Pull Request templates |

### Referencia
Ver [ADR-012: Decisión de No Migrar a Angular](12_ADR.md#adr-012-decisión-de-no-migrar-a-angular) para el análisis completo.

---

> **Siguiente documento:** [02_FASE_1_FUNDACION.md](02_FASE_1_FUNDACION.md)
