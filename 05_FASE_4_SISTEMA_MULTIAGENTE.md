# 🤖 FASE 4: SISTEMA MULTI-AGENTE — La Organización Digital

> **Duración:** Semanas 11-16  
> **Objetivo:** 8+ agentes especializados colaborando para producir proyectos completos  
> **Costo:** $0/mes (LangGraph + Gemini + PostgreSQL)

---

## 🏛️ La Organización Digital KAIZEN

```
                    ┌───────────────────────────────┐
                    │   CONSEJO ESTRATÉGICO          │
                    │  (Orquestador Principal)       │
                    └───────────┬───────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────┐
│   DIRECTOR    │     │    DIRECTOR       │     │   DIRECTOR    │
│  ESTRATÉGICO  │     │   FINANCIERO      │     │   JURÍDICO    │
├───────────────┤     ├───────────────────┤     ├───────────────┤
│ • Planeación  │     │ • VAN / TIR / ROI │     │ • Normativa   │
│ • Marco Lógico│     │ • Flujo de Caja   │     │ • Contratos   │
│ • OKR / BSC   │     │ • Presupuesto     │     │ • Riesgos     │
│ • Canvas      │     │ • Escenarios      │     │ • Permisos    │
└───────────────┘     └───────────────────┘     └───────────────┘

        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────┐
│   DIRECTOR    │     │    DIRECTOR       │     │   DIRECTOR    │
│   COMERCIAL   │     │  INVESTIGACIÓN    │     │ CONVOCATORIAS │
├───────────────┤     ├───────────────────┤     ├───────────────┤
│ • Est. Mercado│     │ • Estado del Arte │     │ • Fondo Emp.  │
│ • Buyer Persona│    │ • Marco Teórico   │     │ • iNNpulsa    │
│ • TAM/SAM/SOM │     │ • Benchmark      │     │ • MinCiencias │
│ • Competencia │     │ • Vigilancia Tec.│     │ • Cooperación │
└───────────────┘     └───────────────────┘     └───────────────┘

        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────┐
│   DIRECTOR    │     │    DIRECTOR       │     │   DIRECTOR    │
│   RIESGOS     │     │     PMO           │     │   CALIDAD     │
├───────────────┤     ├───────────────────┤     ├───────────────┤
│ • ISO 31000   │     │ • Cronograma     │     │ • ISO 9001    │
│ • Matriz     │     │ • WBS             │     │ • Validación  │
│ • COSO       │     │ • Recursos        │     │ • Auditoría   │
│ • Mitigación  │     │ • Seguimiento    │     │ • Métricas    │
└───────────────┘     └───────────────────┘     └───────────────┘
```

---

## 📋 Checklist

- [ ] **Paso 1:** Configurar LangGraph como orquestador
- [ ] **Paso 2:** Crear Director Estratégico (planeación)
- [ ] **Paso 3:** Crear Director Financiero (análisis financiero)
- [ ] **Paso 4:** Crear Director Jurídico (normativa)
- [ ] **Paso 5:** Crear Director Comercial (mercado)
- [ ] **Paso 6:** Crear Director de Investigación
- [ ] **Paso 7:** Crear Director de Convocatorias
- [ ] **Paso 8:** Crear Director de Riesgos
- [ ] **Paso 9:** Sistema de colaboración entre agentes
- [ ] **Paso 10:** Interfaz de "mesa técnica" (colaboración visible)

---

## 🧩 Paso 1: LangGraph — Orquestador Principal

```bash
npm install @langchain/core @langchain/langgraph @langchain/google-genai
```

```typescript
// packages/agents/src/orchestrator/graph.ts
import { StateGraph, Annotation, messagesStateReducer } from '@langchain/langgraph'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

// Estado del sistema multi-agente
const AgentState = Annotation.Root({
  messages: Annotation({ reducer: messagesStateReducer }),
  project: Annotation<Project>(),
  currentPhase: Annotation<string>(),
  agentResults: Annotation<Record<string, any>>(),
  decisionLog: Annotation<Decision[]>(),
  pendingActions: Annotation<string[]>(),
})

// El Consejo Estratégico (orquestador)
export async function createOrchestrator() {
  const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    temperature: 0.3,
  })

  const graph = new StateGraph(AgentState)
  
  // Definir nodos (agentes)
  graph.addNode('strategic_director', createStrategicDirector(llm))
  graph.addNode('financial_director', createFinancialDirector(llm))
  graph.addNode('legal_director', createLegalDirector(llm))
  graph.addNode('commercial_director', createCommercialDirector(llm))
  graph.addNode('research_director', createResearchDirector(llm))
  graph.addNode('calls_director', createCallsDirector(llm))
  graph.addNode('risk_director', createRiskDirector(llm))
  graph.addNode('consolidator', createConsolidator(llm))
  
  // Definir flujo de colaboración
  graph.addEdge('__start__', 'strategic_director')
  graph.addConditionalEdges('strategic_director', determineNextAgent, {
    financial: 'financial_director',
    legal: 'legal_director',
    commercial: 'commercial_director',
    research: 'research_director',
    calls: 'calls_director',
    risks: 'risk_director',
    consolidate: 'consolidator',
  })
  graph.addEdge('financial_director', 'legal_director')
  graph.addEdge('legal_director', 'commercial_director')
  graph.addEdge('commercial_director', 'research_director')
  graph.addEdge('research_director', 'calls_director')
  graph.addEdge('calls_director', 'risk_director')
  graph.addEdge('risk_director', 'consolidator')
  graph.addEdge('consolidator', '__end__')

  return graph.compile()
}

// Decidir qué agente convocar según el proyecto
function determineNextAgent(state: typeof AgentState.State) {
  const project = state.project
  const missing = state.pendingActions
  
  if (missing.includes('budget') || missing.includes('financial')) return 'financial'
  if (missing.includes('legal') || missing.includes('regulation')) return 'legal'
  if (missing.includes('market') || missing.includes('commercial')) return 'commercial'
  if (missing.includes('research') || missing.includes('investigation')) return 'research'
  if (missing.includes('calls') || missing.includes('funding')) return 'calls'
  if (missing.includes('risks')) return 'risks'
  
  return 'consolidate'
}
```

---

## 📋 Paso 2: Director Estratégico

```typescript
// packages/agents/src/directors/strategic-director.ts

const STRATEGIC_SYSTEM_PROMPT = `Eres el DIRECTOR ESTRATÉGICO de KAIZEN.
Tu misión es convertir una idea en una estrategia estructurada.

RESPONSABILIDADES:
- Analizar el objetivo del usuario
- Definir el alcance del proyecto
- Determinar la metodología adecuada
- Identificar qué otros especialistas se necesitan

PRODUCTOS QUE GENERAS:
- Árbol de Problemas
- Árbol de Objetivos
- Objetivos SMART
- Mapa Estratégico
- Metodología recomendada

METODOLOGÍAS QUE DOMINAS:
- Marco Lógico
- Lean Canvas / Business Model Canvas
- PMBOK (iniciación)
- OKR / Balanced Scorecard
- Design Thinking (fase inicial)

REGLAS:
1. Siempre empieza por entender el problema
2. Valida que el objetivo sea SMART
3. Recomienda la metodología más adecuada
4. Identifica qué información falta
5. Determina qué otros directores deben participar`

export function createStrategicDirector(llm: ChatGoogleGenerativeAI) {
  return async (state: typeof AgentState.State) => {
    const result = await llm.invoke([
      { role: 'system', content: STRATEGIC_SYSTEM_PROMPT },
      { role: 'user', content: `Analiza este proyecto y determina la estrategia:
        ${JSON.stringify(state.project)}
        
        Basado en la información disponible, genera:
        1. Árbol de Problemas (problema central, causas, efectos)
        2. Objetivos SMART
        3. Metodología recomendada
        4. Próximos pasos y qué especialistas se necesitan
      `},
    ])

    return {
      agentResults: {
        ...state.agentResults,
        strategic: result.content,
      },
      currentPhase: 'strategic_analysis',
    }
  }
}
```

---

## 💰 Paso 3: Director Financiero

```typescript
// packages/agents/src/directors/financial-director.ts

const FINANCIAL_SYSTEM_PROMPT = `Eres el DIRECTOR FINANCIERO de KAIZEN.
Evalúas la viabilidad económica de proyectos.

RESPONSABILIDADES:
- Calcular VAN, TIR, ROI
- Elaborar flujo de caja proyectado
- Analizar estructura de costos
- Determinar punto de equilibrio
- Evaluar fuentes de financiación
- Análisis de sensibilidad

PRODUCTOS:
- Flujo de Caja Proyectado (3-5 años)
- Estado de Resultados Proyectado
- Indicadores Financieros (VAN, TIR, ROI, PRI)
- Análisis de Sensibilidad (optimista, conservador, crítico)
- Estructura de Financiación
- Punto de Equilibrio

REGLAS:
1. Toda cifra debe tener una fuente o supuesto explícito
2. Siempre incluye 3 escenarios
3. Valida consistencia con el alcance del proyecto
4. Si faltan datos, solicítalos explícitamente`

export function createFinancialDirector(llm: ChatGoogleGenerativeAI) {
  return async (state: typeof AgentState.State) => {
    const context = await retrieveContext(
      'análisis financiero proyectos presupuesto',
      state.project.organization_id
    )

    const result = await llm.invoke([
      { role: 'system', content: FINANCIAL_SYSTEM_PROMPT },
      { role: 'system', content: `Contexto relevante: ${JSON.stringify(context)}` },
      { role: 'user', content: `Analiza financieramente este proyecto:
        ${JSON.stringify(state.project)}
        
        Genera:
        1. Estructura de costos (inversión + operación)
        2. Flujo de caja proyectado
        3. Indicadores (VAN, TIR, ROI)
        4. Análisis de sensibilidad (3 escenarios)
        5. Fuentes de financiación recomendadas
        6. Punto de equilibrio
      `},
    ])

    return {
      agentResults: {
        ...state.agentResults,
        financial: parseFinancialAnalysis(result.content),
      },
    }
  }
}
```

---

## ⚖️ Paso 4: Director Jurídico

```typescript
// packages/agents/src/directors/legal-director.ts

const LEGAL_SYSTEM_PROMPT = `Eres el DIRECTOR JURÍDICO de KAIZEN.
Evalúas el cumplimiento normativo y legal de proyectos.
Especializado en normativa colombiana y latinoamericana.

RESPONSABILIDADES:
- Identificar normativa aplicable
- Verificar requisitos legales
- Evaluar riesgos jurídicos
- Recomendar estructura legal
- Validar contratos y permisos

PRODUCTOS:
- Matriz Normativa Aplicable
- Checklist de Requisitos Legales
- Riesgos Jurídicos Identificados
- Recomendaciones de Cumplimiento
- Estructura Legal Recomendada

DOMINIOS LEGALES:
- Contratación estatal (Ley 80, Ley 1150)
- Propiedad intelectual
- Protección de datos (Ley 1581)
- Derecho comercial / sociedades
- Normativa sectorial
- Regulación de cada convocatoria`

export function createLegalDirector(llm: ChatGoogleGenerativeAI) {
  return async (state: typeof AgentState.State) => {
    // Consultar base de conocimiento jurídico
    const legalContext = await retrieveContext(
      `normativa aplicable ${state.project.sector} ${state.project.country}`,
      state.project.organization_id
    )

    const result = await llm.invoke([
      { role: 'system', content: LEGAL_SYSTEM_PROMPT },
      { role: 'system', content: `Contexto normativo: ${JSON.stringify(legalContext)}` },
      { role: 'user', content: `Analiza los requisitos legales de este proyecto:
        ${JSON.stringify(state.project)}
        
        Genera:
        1. Normativa aplicable (leyes, decretos, resoluciones)
        2. Requisitos legales obligatorios
        3. Riesgos jurídicos identificados
        4. Estructura legal recomendada
        5. Permisos y licencias necesarias
      `},
    ])

    return {
      agentResults: {
        ...state.agentResults,
        legal: result.content,
      },
    }
  }
}
```

---

## 📊 Paso 5-8: Directores Restantes

```typescript
// packages/agents/src/directors/commercial-director.ts
const COMMERCIAL_PROMPT = `Eres el DIRECTOR COMERCIAL de KAIZEN.
Analizas mercados, clientes y competencia.
Conoces metodologías de investigación de mercados.

Generas:
- Estudio de Mercado (TAM, SAM, SOM)
- Buyer Persona
- Análisis de Competencia
- Propuesta de Valor (Value Proposition Canvas)
- Estrategia Comercial
- Proyección de Ventas`

// packages/agents/src/directors/research-director.ts
const RESEARCH_PROMPT = `Eres el DIRECTOR DE INVESTIGACIÓN de KAIZEN.
Realizas estado del arte, marco teórico y vigilancia tecnológica.

Generas:
- Estado del Arte
- Marco Teórico
- Benchmarking
- Análisis Bibliométrico
- Tendencias del Sector
- Fuentes y Referencias`

// packages/agents/src/directors/calls-director.ts
const CALLS_PROMPT = `Eres el DIRECTOR DE CONVOCATORIAS de KAIZEN.
Identificas oportunidades de financiación para el proyecto.

Generas:
- Convocatorias compatibles con el proyecto
- Índice de compatibilidad por convocatoria
- Requisitos de cada convocatoria
- Documentos necesarios
- Fechas clave y cronograma
- Recomendaciones para mejorar la postulación`

// packages/agents/src/directors/risk-director.ts
const RISK_PROMPT = `Eres el DIRECTOR DE RIESGOS de KAIZEN.
Aplicas ISO 31000 y COSO para identificar y mitigar riesgos.

Generas:
- Matriz de Riesgos (probabilidad x impacto)
- Riesgos identificados por categoría
- Plan de mitigación
- Riesgos críticos
- Seguimiento de riesgos`
```

---

## 🤝 Paso 9: Colaboración entre Agentes

```typescript
// packages/agents/src/orchestrator/consolidator.ts

export function createConsolidator(llm: ChatGoogleGenerativeAI) {
  return async (state: typeof AgentState.State) => {
    const allResults = state.agentResults
    
    // 1. Detectar conflictos entre agentes
    const conflicts = await detectConflicts(allResults)
    
    // 2. Resolver conflictos
    const resolution = conflicts.length > 0
      ? await resolveConflicts(allResults, conflicts)
      : null
    
    // 3. Consolidar en expediente final
    const consolidated = await llm.invoke([
      { role: 'system', content: `Eres el CONSOLIDADOR del Consejo Estratégico.
        Tu misión es integrar los informes de todos los directores en un expediente coherente.
        
        DEBES:
        - Identificar puntos en común entre los informes
        - Resolver contradicciones
        - Priorizar recomendaciones
        - Generar un expediente unificado
        
        NO DEBES:
        - Ignorar advertencias de los directores
        - Perder información importante
        - Generar conclusiones sin evidencia`},
      { role: 'user', content: `Consolida estos informes en un expediente único:
        
        DIRECTOR ESTRATÉGICO:
        ${allResults.strategic}
        
        DIRECTOR FINANCIERO:
        ${allResults.financial}
        
        DIRECTOR JURÍDICO:
        ${allResults.legal}
        
        DIRECTOR COMERCIAL:
        ${allResults.commercial}
        
        DIRECTOR DE INVESTIGACIÓN:
        ${allResults.research}
        
        DIRECTOR DE CONVOCATORIAS:
        ${allResults.calls}
        
        DIRECTOR DE RIESGOS:
        ${allResults.risks}
        
        Genera un expediente consolidado con:
        1. Resumen ejecutivo
        2. Análisis por dimensión
        3. Recomendaciones prioritarias
        4. Próximos pasos
        5. Documentos a generar
      `},
    ])

    return {
      agentResults: {
        ...state.agentResults,
        consolidated: consolidated.content,
      },
      currentPhase: 'completed',
    }
  }
}

// Detectar conflictos entre informes de agentes
async function detectConflicts(results: Record<string, any>) {
  // Por ejemplo: Financiero dice presupuesto $50M, Estratégico dice $80M
  // Lógica de detección de inconsistencias
  return []
}
```

---

## 👁️ Paso 10: Interfaz de Mesa Técnica

```tsx
// apps/web/src/components/agents/CollaborationBoard.tsx
'use client'

export function CollaborationBoard({ projectId }: { projectId: string }) {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [consolidated, setConsolidated] = useState<string>('')

  return (
    <div className="space-y-6">
      {/* Estado de cada agente */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Muro de decisiones */}
      <DecisionLog decisions={decisions} />

      {/* Informe consolidado */}
      <ConsolidatedReport content={consolidated} />

      {/* Chat con el Consejo */}
      <BoardChat projectId={projectId} />
    </div>
  )
}

function AgentCard({ agent }: { agent: AgentStatus }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={agent.avatar} />
          <AvatarFallback>{agent.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
        </div>
        <Badge variant={agent.status === 'completed' ? 'success' : 'processing'}>
          {agent.status}
        </Badge>
      </div>
      
      {/* Progreso */}
      <Progress value={agent.progress} className="mt-3" />
      
      {/* Acciones */}
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline">Ver informe</Button>
        <Button size="sm" variant="ghost">Conversar</Button>
      </div>
    </div>
  )
}
```

---

## ✅ Definition of Done — FASE 4

- [ ] Orquestador (Consejo Estratégico) funcional con LangGraph
- [ ] Director Estratégico genera árbol de problemas + objetivos SMART
- [ ] Director Financiero calcula VAN/TIR/ROI con 3 escenarios
- [ ] Director Jurídico identifica normativa aplicable
- [ ] Director Comercial genera estudio de mercado
- [ ] Director de Investigación produce estado del arte
- [ ] Director de Convocatorias hace matching con oportunidades
- [ ] Director de Riesgos genera matriz ISO 31000
- [ ] Consolidados: los 7 informes se integran en un expediente
- [ ] Interfaz de "mesa técnica" visible para el usuario
- [ ] Detección de conflictos entre agentes
- [ ] Trazabilidad de cada decisión

---

> **Siguiente fase:** [06_FASE_5_INTEGRACIONES.md](06_FASE_5_INTEGRACIONES.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
