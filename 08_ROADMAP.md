# 🗺️ ROADMAP — KAIZEN PROJECT'S IA

> **Timeline:** 24 semanas (6 meses)  
> **Costo:** $0/mes  
> **Estado:** Planificación activa

---

## 📊 Timeline Visual

```
Semana 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
        │           │           │           │           │           │
FASE 1  ████████████┤           │           │           │           │
Fundación           │           │           │           │           │
                    │           │           │           │           │
FASE 2  └───────────████████████████┤        │           │           │
MVP Core                            │        │           │           │
                                    │        │           │           │
FASE 3  └───────────────────────────████████████████┤    │           │
Knowledge Engine                                    │    │           │
                                                    │    │           │
FASE 4  └───────────────────────────────────────────████████████████┤
Multi-Agente                                                        │
                                                                    │
FASE 5  └───────────────────────────────────────────────────────────████████████████
Integraciones & Marketplace
```

---

## 🎯 Hitos y Métricas

| Hito | Fecha | Métrica de Éxito | ¿Listo? |
|------|-------|------------------|---------|
| **H1: Fundación** | Semana 2 | App en producción con auth + DB | ❌ |
| **H2: Alpha** | Semana 4 | Usuario conversa con KAIZEN | ❌ |
| **H3: MVP** | Semana 6 | Proyecto estructurado exportable | ❌ |
| **H4: Knowledge** | Semana 10 | RAG funcional, KAIZEN aprende | ❌ |
| **H5: Beta** | Semana 12 | 100 usuarios, correcciones | ❌ |
| **H6: Multi-Agente** | Semana 16 | 8 agentes colaborando | ❌ |
| **H7: Integraciones** | Semana 20 | Convocatorias reales + formatos | ❌ |
| **H8: Lanzamiento** | Semana 24 | Marketplace + APIs abiertas | ❌ |

---

## 📋 Fase 1: Fundación (Semanas 1-2)

### Semana 1: Setup Inicial
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 1 | Crear monorepo con Turborepo | `kaizen-project/` repositorio |
| 2 | Configurar Next.js + TypeScript + Tailwind | App base corriendo en localhost |
| 3 | Configurar Supabase (DB + Auth + Storage) | Tablas iniciales creadas |
| 4 | Implementar autenticación (email + Google) | Login/Register funcional |
| 5 | Crear layouts, sidebar, navegación | UI base responsiva |
| 6 | Configurar temas claro/oscuro | Tema switcher funcional |

### Semana 2: Infraestructura
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 7 | Configurar ESLint + Prettier + Husky | Código limpio automático |
| 8 | Crear pipelines CI/CD (GitHub Actions) | Tests + deploy automáticos |
| 9 | Deploy a Vercel (preview + production) | App en https://kaizen.vercel.app |
| 10 | Configurar Sentry (error tracking) | Monitoreo de errores activo |
| 11 | Integrar Supabase SSR | Auth fluido sin flickering |
| 12 | Documentar arquitectura + decisiones | ADRs + docs iniciales |

**🎯 HITO 1: Fundación completa — App en producción**

---

## 💬 Fase 2: MVP Core (Semanas 3-6)

### Semana 3: Chat + Gemini
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 13 | Integrar Google Gemini API | Chat básico funcional |
| 14 | Implementar streaming de respuestas | Respuestas en tiempo real |
| 15 | Crear interfaz de chat (burbujas, typing indicator) | UI de chat pulida |
| 16 | Sistema de prompts del sistema (system prompts) | KAIZEN responde como experto |
| 17 | Persistencia de conversaciones en DB | Historial guardado |
| 18 | Fallback con OpenRouter | Resiliencia ante límites |

### Semana 4: Discovery Engine
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 19 | Implementar fases del Discovery | ¿Comprender? → ¿Descubrir? → ... |
| 20 | Preguntas adaptativas (basadas en estado) | Preguntas inteligentes |
| 21 | Calculadora de completitud del proyecto | Barra de progreso |
| 22 | Extracción de información estructurada | JSON estructurado del chat |
| 23 | Detección de información faltante | Alertas de campos requeridos |
| 24 | Testing de flujo conversacional | 10 flujos probados |

### Semana 5: Plantillas + Exportación
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 25 | Template: Marco Lógico | Estructura completa |
| 26 | Template: Lean Canvas | Canvas interactivo |
| 27 | Generación de PDF (@react-pdf) | PDF descargable |
| 28 | Generación de Markdown | Markdown exportable |
| 29 | Generación de DOCX (docx) | Word descargable |
| 30 | Preview de documentos en web | Vista previa antes de exportar |

### Semana 6: MVP Completo
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 31 | Versionado de proyectos | Historial de cambios |
| 32 | Autocompletado inteligente | Sugerencias contextuales |
| 33 | Refinamiento UX/UI | Diseño pulido |
| 34 | Beta cerrada (10 usuarios) | Feedback inicial |
| 35 | Correcciones basadas en feedback | MVP estable |
| 36 | **MVP COMPLETO** | KAIZEN funcional 🎉 |

**🎯 HITO 3: MVP — Usuario conversa y obtiene proyecto exportable**

---

## 🧠 Fase 3: Knowledge Engine (Semanas 7-10)

### Semana 7: Pipeline de Ingesta
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 37 | Pipeline: PDF loader | Documentos PDF procesados |
| 38 | Pipeline: DOCX + MD + TXT | Múltiples formatos soportados |
| 39 | Chunking inteligente (semántico) | Chunks con contexto |
| 40 | Limpieza y normalización de texto | Texto limpio |
| 41 | Upload de documentos via web | Interfaz de subida |
| 42 | Extracción de metadatos | Título, autor, fecha, dominio |

### Semana 8: Embeddings + pgvector
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 43 | Configurar pgvector en Supabase | Vector DB lista |
| 44 | Integrar Gemini Embeddings API | Embeddings funcionales |
| 45 | Batch embeddings para documentos grandes | Procesamiento eficiente |
| 46 | Índice vectorial (IVFFlat) | Búsqueda rápida |
| 47 | Almacenar embeddings en DB | Datos persistidos |
| 48 | Búsqueda vectorial básica (KNN) | "Encuentra docs similares" |

### Semana 9: RAG Híbrido
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 49 | Búsqueda full-text (PostgreSQL tsvector) | Text search funcional |
| 50 | Búsqueda híbrida (vector + texto) | RRF fusion |
| 51 | Context assembly para LLM | Prompt con contexto |
| 52 | Sistema de citas y fuentes | Respuestas con referencias |
| 53 | Filtrado por dominio y organización | RAG multi-tenant |
| 54 | Confidence scoring del contexto | Índice de confianza |

### Semana 10: Knowledge Graph + Memoria
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 55 | Extracción de entidades con Gemini | Entidades del texto |
| 56 | Construcción de relaciones semánticas | Grafo de conocimiento |
| 57 | Visualización del grafo (simple) | Mapa visual de conceptos |
| 58 | Memoria organizacional (lecciones) | KAIZEN aprende de proyectos |
| 59 | Clasificación automática de documentos | Organización por dominio |
| 60 | **KNOWLEDGE ENGINE COMPLETO** 🎉 | RAG + Graph + Memoria |

**🎯 HITO 4: KAIZEN aprende de documentos y proyectos anteriores**

---

## 🤖 Fase 4: Multi-Agente (Semanas 11-16)

### Semana 11: Orquestador
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 61 | Configurar LangGraph | Framework de agentes listo |
| 62 | Definir estado global del sistema | Tipos y schemas |
| 63 | Crear grafo de orquestación | Pipeline multi-agente |
| 64 | Sistema de routing entre agentes | ¿Qué agente sigue? |
| 65 | Manejo de errores y retry | Resiliencia |
| 66 | Logging de decisiones | Trazabilidad |

### Semana 12: Directores (Parte 1)
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 67 | Director Estratégico | Árbol de problemas + objetivos |
| 68 | Director Financiero | VAN, TIR, flujo de caja |
| 69 | Director Jurídico | Normativa + riesgos legales |
| 70 | Testing de agentes individuales | Cada agente funciona solo |
| 71 | Integración con RAG | Agentes usan conocimiento |
| 72 | Refinamiento de prompts | Mejores respuestas |

### Semana 13: Directores (Parte 2)
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 73 | Director Comercial | Estudio de mercado |
| 74 | Director de Investigación | Estado del arte |
| 75 | Director de Convocatorias | Matching con oportunidades |
| 76 | Director de Riesgos | Matriz ISO 31000 |
| 77 | Testing + refinamiento | Calidad asegurada |
| 78 | **8 AGENTES FUNCIONALES** 🎉 | Equipo completo |

### Semana 14: Colaboración
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 79 | Flujo completo: Idea → 8 agentes → Expediente | Pipeline completo |
| 80 | Detección de conflictos entre agentes | Alertas de inconsistencias |
| 81 | Resolución automática de conflictos | Consenso inteligente |
| 82 | Consolidación de informes | Expediente unificado |
| 83 | Trazabilidad de decisiones | Auditoría completa |
| 84 | Optimización de performance | Respuestas más rápidas |

### Semana 15: UI de Colaboración
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 85 | Interfaz "Mesa Técnica" | Vista de colaboración |
| 86 | Estado en vivo de cada agente | Progreso visible |
| 87 | Chat individual con cada agente | Conversación directa |
| 88 | Historial de decisiones | Timeline visual |
| 89 | Notificaciones de completitud | Alertas de agentes listos |
| 90 | **COLABORACIÓN VISIBLE** 🎉 | UI completa |

### Semana 16: Beta
| Día | Actividad | Entregable |
|-----|-----------|-----------|
| 91 | Beta ampliada (100 usuarios) | Pruebas masivas |
| 92 | Recopilar feedback | Issues + mejoras |
| 93 | Correcciones críticas | Estabilidad |
| 94 | Optimización de costos LLM | Caching + batching |
| 95 | Documentación de API | Docs públicos |
| 96 | **BETA COMPLETA** 🎉 | KAIZEN 2.0 |

**🎯 HITO 6: Beta — Multi-agente funcional con 100 usuarios**

---

## 🔌 Fase 5: Integraciones (Semanas 17-24)

### Semanas 17-18: Convocatorias Colombianas
| Actividad | Entregable |
|-----------|-----------|
| Modelar entidades, programas y convocatorias | DB de convocatorias |
| Poblar datos iniciales (15+ convocatorias) | Fondo Emprender, iNNpulsa, etc. |
| Motor de compatibilidad | Score de matching proyecto↔convocatoria |
| Actualización automática (scraping + manual) | Convocatorias siempre vigentes |
| Notificaciones de nuevas convocatorias | Alertas al usuario |

### Semanas 19-20: Formatos Oficiales
| Actividad | Entregable |
|-----------|-----------|
| Formato MGA (DNP Colombia) | Exportación XML + PDF |
| Formato Fondo Emprender | Plan de negocio oficial |
| Formatos SENA / MinCiencias | Plantillas oficiales |
| Validaciones automáticas por formato | Zero-error en formatos |
| Exportación a Excel profesional | Tablas financieras formateadas |

### Semanas 21-22: APIs + Dashboard
| Actividad | Entregable |
|-----------|-----------|
| API REST pública (documentada) | Endpoints v1 |
| API Keys para terceros | Autenticación de APIs |
| Dashboard analítico | KPIs + gráficos |
| Webhooks (eventos) | Integración externa |
| Documentación OpenAPI/Swagger | Docs interactivos |

### Semanas 23-24: Marketplace + Lanzamiento
| Actividad | Entregable |
|-----------|-----------|
| Sistema de Skills publicables | Marketplace funcional |
| Instalación de Skills de comunidad | Extensible por terceros |
| Landing page oficial | kaizen.ai |
| Documentación completa | Guías + tutoriales |
| **LANZAMIENTO PÚBLICO** 🎉 | KAIZEN v1.0 |

**🎯 HITO 8: Lanzamiento público — KAIZEN PROJECT'S IA v1.0**

---

## 📈 Definición de Éxito Global

| Área | Métrica | Objetivo |
|------|---------|----------|
| **Usuarios** | Usuarios registrados | > 1000 en 3 meses |
| **Proyectos** | Proyectos creados | > 500 |
| **Proyectos** | Tasa de completitud | > 70% |
| **Conocimiento** | Documentos indexados | > 1000 |
| **Conocimiento** | Precisión de RAG | > 85% |
| **Agentes** | Precisión de recomendaciones | > 80% |
| **Calidad** | Satisfacción de usuario | > 4.5/5 |
| **Técnica** | Tiempo de respuesta chat | < 2s |
| **Técnica** | Uptime | > 99.5% |
| **Costo** | Costo mensual | $0/mes |

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Límites de API gratuitas | Media | Alto | Caching, fallback OpenRouter, rate limiting |
| Crecimiento de DB > 500MB | Alta | Medio | Migrar a plan pago ($25/mes) o limpiar datos viejos |
| Complejidad multi-agente | Alta | Alto | MVP con 3 agentes primero, luego escalar |
| Baja adopción de usuarios | Media | Alto | Feedback loop temprano, beta cerrada |
| Cambios en APIs externas | Baja | Medio | Abstracción de APIs, múltiples providers |
| Costos de infraestructura | Baja | Medio | Serverless-first, optimización continua |

---

## 🎉 ¡Manos a la Obra!

Este roadmap es tu guía. Empieza por la **FASE 1** y avanza paso a paso.

```
📖 Comienza aquí:
→ 02_FASE_1_FUNDACION.md (si quieres empezar a construir)
→ 07_RECURSOS_GRATUITOS.md (si necesitas herramientas)
→ 01_PLAN_MAESTRO.md (si quieres la visión general)
```

> **"No automatizamos tareas. Automatizamos razonamiento."** — KAIZEN PROJECT'S IA

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
