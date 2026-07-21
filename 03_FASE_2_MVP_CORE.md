# 💬 FASE 2: MVP CORE — Kaizen Discovery Engine (KDE)

> **Duración:** Semanas 3-6  
> **Objetivo:** Usuario conversa con KAIZEN y obtiene un proyecto estructurado  
> **Costo:** $0/mes (Gemini API gratuita)

---

## 🎯 El Corazón del Producto

El **Kaizen Discovery Engine (KDE)** es el motor conversacional que transforma una idea desordenada en un expediente técnico estructurado. Es la puerta de entrada a todo el ecosistema.

```
IDEA del usuario
    │
    ▼
┌─────────────────────────────────────────┐
│         KAIZEN DISCOVERY ENGINE          │
│                                         │
│  1. Comprender → ¿Qué quiere realmente? │
│  2. Descubrir → ¿Qué falta?             │
│  3. Investigar → ¿Qué evidencia existe? │
│  4. Validar → ¿Es consistente?          │
│  5. Estructurar → Expediente formal     │
│  6. Generar → Documentos exportables    │
└─────────────────────────────────────────┘
    │
    ▼
PROYECTO ESTRUCTURADO (PDF, Word, Markdown)
```

---

## 📋 Checklist MVP

- [ ] **Paso 1:** Integrar Google Gemini API (chat streaming)
- [ ] **Paso 2:** Crear interfaz de chat conversacional
- [ ] **Paso 3:** Implementar el Discovery Engine (preguntas adaptativas)
- [ ] **Paso 4:** Sistema de plantillas de proyectos
- [ ] **Paso 5:** Generación de documentos exportables
- [ ] **Paso 6:** Historial y versionado de proyectos
- [ ] **Paso 7:** Autocompletado inteligente con datos del usuario

---

## 🤖 Paso 1: Integración LLM — Google Gemini

### Setup de Gemini API

```bash
# Obtener API Key gratuita
# 1. Ir a https://aistudio.google.com/
# 2. Get API Key → Create API Key
# 3. Guardar en .env.local

GEMINI_API_KEY=AIza...
# Modelo gratuito: gemini-1.5-flash (60 req/min)
```

```typescript
// packages/ai/src/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // GRATIS - 60 requests/minuto (actualizado Julio 2026)
  // Fallback: si 2.0 no está disponible, usar 'gemini-1.5-flash'
  systemInstruction: `Eres KAIZEN, un asistente experto en formulación de proyectos.
  Tu misión es guiar al usuario desde una idea inicial hasta un proyecto estructurado.
  Sigue el proceso: Comprender → Descubrir → Investigar → Validar → Estructurar.
  Siempre pide evidencia cuando sea necesario.
  No inventes información.`,
})

export const geminiProModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro', // Limitado pero GRATIS en tier
})

// Chat con streaming
export async function* streamChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
) {
  const chat = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  }).startChat({
    history: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  })

  const result = await chat.sendMessageStream('Continúa la conversación.')
  
  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}
```

### Fallback con OpenRouter (más modelos gratuitos)

```typescript
// packages/ai/src/openrouter.ts
// OpenRouter da acceso gratuito a múltiples modelos
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function callOpenRouter(messages: any[]) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      // Alternativas gratuitas:
      // 'meta-llama/llama-3.2-3b-instruct:free'
      // 'microsoft/phi-3-mini-128k-instruct:free'
      messages,
      stream: true,
    }),
  })
  return response
}
```

---

## 💬 Paso 2: Interfaz de Chat Conversacional

```tsx
// apps/web/src/components/chat/ChatInterface.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useChat } from '@ai-sdk/react'

export function ChatInterface({ projectId }: { projectId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { projectId },
  })

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
```

### API Route del Chat

```typescript
// apps/web/src/app/api/chat/route.ts
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages, projectId } = await req.json()

  // Obtener contexto del proyecto
  const project = await getProjectContext(projectId)
  
  // Obtener conocimiento relevante (RAG)
  const context = await retrieveContext(messages[messages.length - 1].content)

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: `
      Eres KAIZEN, experto en formulación de proyectos.
      Contexto del proyecto: ${JSON.stringify(project)}
      Conocimiento relevante: ${JSON.stringify(context)}

      Sigue estos pasos en orden:
      1. COMPRENDER: Entiende la idea del usuario
      2. DESCUBRIR: Pregunta por información faltante
      3. INVESTIGAR: Usa el conocimiento disponible
      4. VALIDAR: Verifica consistencia
      5. ESTRUCTURAR: Organiza la información

      Importante:
      - Pide evidencia cuando sea necesario
      - No inventes datos
      - Sé conversacional pero estructurado
    `,
    messages,
  })

  return result.toDataStreamResponse()
}
```

---

## 🧠 Paso 3: Discovery Engine — Preguntas Adaptativas

```typescript
// packages/ai/src/discovery-engine.ts

interface DiscoveryState {
  phase: 'comprender' | 'descubrir' | 'investigar' | 'validar' | 'estructurar'
  completeness: number // 0-100
  missingFields: string[]
  evidenceCollected: Evidence[]
}

const DISCOVERY_PHASES = {
  comprender: {
    questions: [
      '¿Cuál es la idea principal de tu proyecto?',
      '¿Qué problema específico resuelve?',
      '¿Quiénes son los beneficiarios directos?',
      '¿Dónde se implementará?',
    ],
    requiredFields: ['objective', 'problem', 'beneficiaries', 'location'],
  },
  descubrir: {
    questions: [
      '¿Cuál es el presupuesto estimado?',
      '¿Cuánto tiempo durará el proyecto?',
      '¿Qué recursos humanos se necesitan?',
      '¿Existen proyectos similares?',
    ],
    requiredFields: ['budget', 'timeline', 'resources', 'antecedents'],
  },
  investigar: {
    questions: [
      '¿Tienes estudios de mercado?',
      '¿Qué normativa aplica?',
      '¿Hay convocatorias activas para este tipo de proyecto?',
      '¿Cuál es el impacto esperado?',
    ],
    requiredFields: ['marketResearch', 'regulation', 'calls', 'impact'],
  },
  validar: {
    actions: [
      'Verificar consistencia entre objetivo y presupuesto',
      'Validar que la normativa aplica correctamente',
      'Confirmar viabilidad técnica',
      'Identificar riesgos iniciales',
    ],
  },
  estructurar: {
    outputs: [
      'Árbol de problemas',
      'Árbol de objetivos',
      'Matriz de marco lógico',
      'Presupuesto preliminar',
      'Cronograma base',
    ],
  },
}

export function calculateCompleteness(project: Project): DiscoveryState {
  const missingFields: string[] = []
  let completedFields = 0
  let totalFields = 0

  for (const [, phase] of Object.entries(DISCOVERY_PHASES)) {
    if (phase.requiredFields) {
      for (const field of phase.requiredFields) {
        totalFields++
        if (!project[field as keyof Project]) {
          missingFields.push(field)
        } else {
          completedFields++
        }
      }
    }
  }

  const completeness = Math.round((completedFields / totalFields) * 100)

  return {
    phase: completeness < 25 ? 'comprender' 
          : completeness < 50 ? 'descubrir'
          : completeness < 75 ? 'investigar'
          : completeness < 90 ? 'validar'
          : 'estructurar',
    completeness,
    missingFields,
    evidenceCollected: [],
  }
}

export function generateNextQuestions(state: DiscoveryState): string[] {
  if (state.completeness >= 100) {
    return ['¡Tu proyecto está completo! ¿Quieres generar los documentos de formulación?']
  }

  const phase = DISCOVERY_PHASES[state.phase]
  
  // Preguntas inteligentes basadas en lo que falta
  return state.missingFields.slice(0, 3).map(field => {
    const fieldQuestions: Record<string, string> = {
      objective: '¿Cuál es el objetivo principal de tu proyecto? (Debe ser SMART)',
      budget: '¿Cuál es el presupuesto total estimado? Incluye costos operativos y de inversión.',
      beneficiaries: 'Describe a los beneficiarios: ¿cuántos son, dónde están, qué características tienen?',
      timeline: '¿En cuánto tiempo planeas ejecutar el proyecto? ¿Tienes hitos definidos?',
      impact: '¿Cuál es el impacto esperado? ¿Cómo lo medirás?',
      marketResearch: '¿Tienes datos de mercado? (TAM, SAM, SOM)',
    }
    return fieldQuestions[field] || `Cuéntame más sobre: ${field}`
  })
}
```

---

## 📐 Paso 4: Sistema de Plantillas

```typescript
// packages/ai/src/templates/marco-logico.ts

export const MARCO_LOGICO_TEMPLATE = {
  name: 'Marco Lógico',
  version: '2.0',
  methodology: 'MGA - Metodología General Ajustada',
  sections: [
    {
      id: 'arbol-problemas',
      title: 'Árbol de Problemas',
      fields: [
        { key: 'problem_central', label: 'Problema Central', type: 'text', required: true },
        { key: 'causes', label: 'Causas', type: 'list', required: true },
        { key: 'effects', label: 'Efectos', type: 'list', required: true },
      ],
      validation: {
        minCauses: 3,
        minEffects: 3,
      },
    },
    {
      id: 'arbol-objetivos',
      title: 'Árbol de Objetivos',
      fields: [
        { key: 'general_objective', label: 'Objetivo General', type: 'text', required: true },
        { key: 'specific_objectives', label: 'Objetivos Específicos', type: 'list', required: true },
      ],
    },
    {
      id: 'matriz-marco-logico',
      title: 'Matriz de Marco Lógico',
      fields: [
        { key: 'fin', label: 'Fin', type: 'text', required: true },
        { key: 'proposito', label: 'Propósito', type: 'text', required: true },
        { key: 'components', label: 'Componentes', type: 'list', required: true },
        { key: 'activities', label: 'Actividades', type: 'list', required: true },
      ],
    },
    {
      id: 'indicators',
      title: 'Indicadores',
      fields: [
        { key: 'impact_indicators', label: 'Indicadores de Impacto', type: 'table' },
        { key: 'result_indicators', label: 'Indicadores de Resultado', type: 'table' },
        { key: 'product_indicators', label: 'Indicadores de Producto', type: 'table' },
      ],
    },
  ],
  exports: ['pdf', 'word', 'xlsx', 'mga-format'],
}
```

```typescript
// packages/ai/src/templates/lean-canvas.ts

export const LEAN_CANVAS_TEMPLATE = {
  name: 'Lean Canvas',
  version: '1.0',
  sections: [
    { id: 'problem', title: 'Problema', fields: [{ key: 'top_problems', type: 'list' }] },
    { id: 'solution', title: 'Solución', fields: [{ key: 'solution', type: 'text' }] },
    { id: 'key_metrics', title: 'Métricas Clave', fields: [{ key: 'metrics', type: 'list' }] },
    { id: 'uvp', title: 'Propuesta Única de Valor', fields: [{ key: 'uvp', type: 'text' }] },
    { id: 'channels', title: 'Canales', fields: [{ key: 'channels', type: 'list' }] },
    { id: 'customer_segments', title: 'Segmentos de Cliente', fields: [{ key: 'segments', type: 'list' }] },
    { id: 'cost_structure', title: 'Estructura de Costos', fields: [{ key: 'costs', type: 'table' }] },
    { id: 'revenue_streams', title: 'Fuentes de Ingreso', fields: [{ key: 'revenue', type: 'table' }] },
    { id: 'unfair_advantage', title: 'Ventaja Especial', fields: [{ key: 'advantage', type: 'text' }] },
  ],
}

// Más templates: PMBOK, Design Thinking, Canvas Social, etc.
```

---

## 📄 Paso 5: Generación de Documentos

```typescript
// packages/ai/src/export/generate-pdf.ts
// Usando: @react-pdf/renderer (gratuito, open source)

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

export async function generateProjectPDF(project: Project) {
  const doc = (
    <Document>
      <Page size="A4">
        <View>
          <Text>{project.name}</Text>
          <Text>Versión: {project.version}</Text>
          <Text>Fecha: {new Date().toLocaleDateString()}</Text>
        </View>
        
        <View>
          <Text>1. Árbol de Problemas</Text>
          <Text>Problema Central: {project.problemCentral}</Text>
          {project.causes.map((c, i) => (
            <Text key={i}>Causa {i + 1}: {c}</Text>
          ))}
        </View>
        {/* ... más secciones ... */}
      </Page>
    </Document>
  )

  const blob = await pdf(doc).toBlob()
  return blob
}

// Alternativa gratuita: html2pdf.js (convierte HTML a PDF)
// O usar Puppeteer en Vercel Edge (limitado pero funcional)
```

```typescript
// packages/ai/src/export/generate-docx.ts
// Usando: docx (npm) - Open Source

import { Document, Packer, Paragraph, Table, TableRow, TableCell } from 'docx'

export async function generateProjectDOCX(project: Project) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: project.name, heading: 'Heading1' }),
        new Paragraph({ text: `Versión: ${project.version}` }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '1. Árbol de Problemas', heading: 'Heading2' }),
        new Paragraph({ text: `Problema Central: ${project.problemCentral}` }),
        ...project.causes.map(cause => 
          new Paragraph({ text: `• ${cause}`, bullet: { level: 0 } })
        ),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  return buffer
}
```

---

## 💾 Paso 6: Historial y Versionado

```sql
-- Tabla de versiones de proyectos
CREATE TABLE project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  version INT NOT NULL,
  data JSONB NOT NULL, -- snapshot completo
  change_summary TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, version)
);

-- Función para versionar automáticamente
CREATE OR REPLACE FUNCTION create_project_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_versions (project_id, version, data, change_summary)
  VALUES (
    NEW.id,
    NEW.version,
    row_to_json(NEW),
    'Auto-saved version'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER version_project
  AFTER UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION create_project_version();
```

```typescript
// apps/web/src/app/api/projects/[id]/versions/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data: versions } = await supabase
    .from('project_versions')
    .select('*')
    .eq('project_id', params.id)
    .order('version', { ascending: false })

  return Response.json(versions)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { version, change_summary } = await req.json()
  const project = await getProject(params.id)

  await supabase.from('project_versions').insert({
    project_id: params.id,
    version,
    data: project,
    change_summary,
  })

  return Response.json({ success: true })
}
```

---

## ✨ Paso 7: Autocompletado Inteligente

```typescript
// packages/ai/src/autocomplete.ts

interface AutocompleteSuggestion {
  field: string
  suggestion: string
  confidence: number
  source: string
}

export async function suggestFieldValue(
  field: string,
  context: Partial<Project>
): Promise<AutocompleteSuggestion[]> {
  const response = await geminiModel.generateContent(`
    Basado en el siguiente contexto de proyecto:
    ${JSON.stringify(context)}

    Sugiere valores para el campo "${field}".
    Provee 3 sugerencias realistas con nivel de confianza.
    Formato: JSON array con { suggestion, confidence, reason }
  `)

  // Parsear respuesta y devolver sugerencias
  return parseSuggestions(response.response.text())
}
```

---

## ✅ Definition of Done — FASE 2

- [ ] Usuario puede iniciar chat con KAIZEN
- [ ] El sistema hace preguntas adaptativas según el avance
- [ ] Se genera un proyecto estructurado (Marco Lógico, Canvas, etc.)
- [ ] Documentos exportables (PDF, Word, Markdown)
- [ ] Historial de versiones funcional
- [ ] Autocompletado basado en contexto
- [ ] Evidencia y trazabilidad básica
- [ ] Streaming de respuestas en tiempo real

---

## 📊 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tiempo para primer proyecto completo | < 30 min |
| Precisión de preguntas generadas | > 85% relevantes |
| Satisfacción de usuario | > 4/5 |
| Exportaciones exitosas | > 90% |
| Proyectos completados | > 100 en beta |

---

> **Siguiente fase:** [04_FASE_3_MOTOR_CONOCIMIENTO.md](04_FASE_3_MOTOR_CONOCIMIENTO.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
