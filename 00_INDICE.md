# 📚 KAIZEN PROJECT'S IA — Índice Maestro de Construcción

> **Versión:** 1.0.0  
> **Estado:** Plan de Construcción Activo  
> **Recursos:** 100% Gratuitos / Open Source / Free Tier  
> **Objetivo:** Transformar la visión documentada en software funcional

---

## 📋 Documentos del Plan

| # | Documento | Descripción | Prioridad |
|---|-----------|-------------|-----------|
| 00 | **00_INDICE.md** | Este índice — mapa de navegación del plan | 🔖 |
| 01 | **01_PLAN_MAESTRO.md** | Visión general, filosofía, arquitectura resumida y plan de 5 fases | ⭐⭐⭐ |
| 02 | **02_FASE_1_FUNDACION.md** | Setup inicial: infraestructura, repositorios, CI/CD, base de datos, autenticación | ⭐⭐⭐ |
| 03 | **03_FASE_2_MVP_CORE.md** | MVP: sistema conversacional + formulación de proyectos básica | ⭐⭐⭐ |
| 04 | **04_FASE_3_MOTOR_CONOCIMIENTO.md** | Knowledge Fabric: RAG, embeddings, graph, memoria organizacional | ⭐⭐ |
| 05 | **05_FASE_4_SISTEMA_MULTIAGENTE.md** | Orquestación de agentes especializados, workflows, colaboración | ⭐⭐ |
| 06 | **06_FASE_5_INTEGRACIONES.md** | Convocatorias, marketplace, exportación, cumplimiento normativo | ⭐ |
| 07 | **07_RECURSOS_GRATUITOS.md** | Catálogo completo de herramientas gratuitas por categoría | 🔧 |
| 08 | **08_ROADMAP.md** | Timeline, hitos, métricas de éxito y definición de done | 🗺️ |
| 09 | **09_GETTING_STARTED.md** | Guía de inicio rápido para desarrolladores | 🚀 |
| 10 | **10_TESTING_STRATEGY.md** | Estrategia de testing (IA, agentes, componentes) | 🧪 |
| 11 | **11_PRIVACY_SECURITY.md** | Privacidad, seguridad y cumplimiento normativo | 🔒 |
| 12 | **12_ADR.md** | Architecture Decision Records — decisiones clave del proyecto | 📐 |
| 13 | **13_CUENTAS_API_PASOS.md** | Checklist completo: todas las cuentas y APIs a crear con pasos exactos | 🔑 |
| 14 | **14_VERCEL_DEPLOY_GUIDE.md** | **[NUEVO]** Guía para configurar VERCEL_TOKEN + deploy automático | 🚀 |
| — | **.env.local** | Archivo de configuración de API keys (NO subir a Git) | ⚙️ |
| — | **.github/workflows/deploy.yml** | **[NUEVO]** CI/CD Pipeline para deploy automático a Vercel | 🔄 |

---

## 📐 Decisión Arquitectónica Clave

> **✅ Next.js sobre Angular** — Después de un análisis exhaustivo, se confirma que **Next.js** es la opción correcta para KAIZEN.  
> Ver [ADR-012: Decisión de No Migrar a Angular](12_ADR.md#adr-012-decisión-de-no-migrar-a-angular) para la justificación completa.

---

## 🧭 Mapa de Navegación Rápida

```
¿Eres nuevo?
    → 00_INDICE.md (este documento)
    → 01_PLAN_MAESTRO.md

¿Quieres empezar a construir?
    → 02_FASE_1_FUNDACION.md
    → 03_FASE_2_MVP_CORE.md

¿Necesitas herramientas gratuitas?
    → 07_RECURSOS_GRATUITOS.md

¿Quieres ver el timeline?
    → 08_ROADMAP.md
```

---

## 🔗 Dependencias entre Fases

```
FASE 1 (Fundación)
    │
    ▼
FASE 2 (MVP Core) ──── Depende de FASE 1
    │
    ├──► FASE 3 (Knowledge Engine) ──── Depende de FASE 2
    │
    └──► FASE 4 (Multi-Agente) ──── Depende de FASE 2 + 3
                │
                ▼
         FASE 5 (Integraciones) ──── Depende de FASE 4
```

---

## 🎯 Stack Tecnológico Elegido (Gratuito)

| Componente | Tecnología | Free Tier |
|------------|-----------|-----------|
| Frontend | Next.js + React + Tailwind | ✅ |
| Backend | Next.js API Routes + Node.js | ✅ |
| Base de Datos | Supabase (PostgreSQL) | ✅ 500MB |
| Autenticación | Supabase Auth / NextAuth | ✅ |
| Vector DB | Supabase pgvector / Chroma | ✅ |
| LLM | Google Gemini API / OpenRouter | ✅ Gratis/Bajo costo |
| Embeddings | Gemini Embeddings / OpenAI | ✅ |
| RAG | LangChain / Vercel AI SDK | ✅ Open Source |
| Hosting | Vercel / Cloudflare Pages | ✅ Free Tier |
| CI/CD | GitHub Actions | ✅ Free |
| Storage | Supabase Storage / Cloudflare R2 | ✅ 1GB-10GB |
| AI Agents | LangGraph / CrewAI / AutoGen | ✅ Open Source |
| Graph DB | PostgreSQL + pg_graphql | ✅ |
| Search | Meilisearch / Typesense | ✅ Open Source |
| Monitoring | Sentry Free / Grafana | ✅ |
| Maps | MapLibre / Leaflet | ✅ Open Source |

---

> **Siguiente documento:** [01_PLAN_MAESTRO.md](01_PLAN_MAESTRO.md)
