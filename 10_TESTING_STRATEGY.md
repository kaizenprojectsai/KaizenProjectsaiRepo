# 🧪 ESTRATEGIA DE TESTING — KAIZEN PROJECT'S IA

> **Objetivo:** Garantizar calidad en un sistema con componentes de IA no-deterministas  
> **Stack:** Vitest + Playwright + Testing Library + Evaluaciones de IA

---

## 📋 Principios de Testing

1. **Todo código nuevo tiene test** — Sin excepción
2. **Tests deterministas para lógica determinista** — Componentes puros
3. **Tests estadísticos para IA** — Validar patrones, no salidas exactas
4. **Mocking de LLM en unit tests** — No llamar APIs reales
5. **Eval de integración con LLM real** — Tests de evaluación semanal

---

## 🏛️ Pirámide de Testing

```
        ┌─────────┐
        │  E2E    │  ← Playwright: flujos completos
        │  (5%)   │
       ┌┴─────────┴┐
       │ Integración│  ← LLM Eval + API tests
       │   (15%)   │
      ┌┴───────────┴┐
      │  Unit Tests │  ← Componentes, lógica, agentes
      │   (80%)    │
      └─────────────┘
```

---

## 🧩 1. Tests Unitarios (Vitest)

### Configuración Inicial

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

### Test de Componente React

```typescript
// apps/web/src/components/chat/__tests__/ChatInterface.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInterface } from '../ChatInterface'

// Mock del hook useChat
vi.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [
      { id: '1', role: 'user', content: 'Hola' },
      { id: '2', role: 'assistant', content: '¿En qué puedo ayudarte?' },
    ],
    input: '',
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    isLoading: false,
  }),
}))

describe('ChatInterface', () => {
  it('renderiza mensajes correctamente', () => {
    render(<ChatInterface projectId="test-123" />)
    
    expect(screen.getByText('Hola')).toBeInTheDocument()
    expect(screen.getByText('¿En qué puedo ayudarte?')).toBeInTheDocument()
  })

  it('tiene input de texto y botón de enviar', () => {
    render(<ChatInterface projectId="test-123" />)
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('no muestra loading spinner cuando no está cargando', () => {
    render(<ChatInterface projectId="test-123" />)
    
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })
})
```

### Test de Función de Negocio

```typescript
// packages/ai/src/__tests__/discovery-engine.test.ts
import { calculateCompleteness, DiscoveryState } from '../discovery-engine'

describe('Discovery Engine', () => {
  it('devuelve fase "comprender" cuando el proyecto está vacío', () => {
    const project = { name: 'Test' } as any
    const result = calculateCompleteness(project)
    
    expect(result.phase).toBe('comprender')
    expect(result.completeness).toBeLessThan(25)
  })

  it('detecta campos faltantes correctamente', () => {
    const project = {
      objective: 'Crear empresa',
      problem: 'Falta empleo',
      beneficiaries: ['Jóvenes'],
      location: 'Medellín',
    } as any
    
    const result = calculateCompleteness(project)
    
    expect(result.missingFields).toContain('budget')
    expect(result.missingFields).toContain('timeline')
  })

  it('calcula completitud del 100% cuando todos los campos están llenos', () => {
    const project = getCompleteProject()
    const result = calculateCompleteness(project)
    
    expect(result.completeness).toBe(100)
    expect(result.phase).toBe('estructurar')
  })
})
```

---

## 🤖 2. Mocking de LLM

```typescript
// test/mocks/gemini.ts
// Mock para evitar llamadas reales a la API en tests unitarios

export function createMockGemini() {
  return {
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => 'Respuesta mock de prueba',
      },
    }),
    startChat: vi.fn().mockReturnValue({
      sendMessageStream: vi.fn().mockReturnValue({
        stream: (async function* () {
          yield { text: 'Chunk 1 ' }
          yield { text: 'Chunk 2 ' }
          yield { text: 'Chunk 3' }
        })(),
      }),
    }),
  }
}

// packages/ai/src/__tests__/rag.test.ts
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => createMockGemini()),
}))

describe('RAG Context Assembly', () => {
  it('construye prompt con contexto', () => {
    const context = {
      chunks: [
        { content: 'El VAN debe ser positivo', similarity: 0.95, source: 'doc1.pdf', domain: 'financiero' },
      ],
      confidence: 0.95,
      query: '¿Qué es VAN?',
    }
    
    const prompt = buildPromptWithContext('¿Qué es VAN?', context)
    
    expect(prompt).toContain('[Fuente 1]')
    expect(prompt).toContain('El VAN debe ser positivo')
    expect(prompt).toContain('Confianza general')
  })
})
```

---

## 🔄 3. Tests de Integración

### API Route Testing

```typescript
// apps/web/src/app/api/chat/__tests__/route.test.ts
import { POST } from '../route'

describe('POST /api/chat', () => {
  it('responde con streaming cuando recibe mensaje válido', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hola' }],
        projectId: '123',
      }),
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/event-stream')
  })

  it('rechaza request sin messages', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(400)
  })
})
```

### Supabase Integration

```typescript
// packages/database/src/__tests__/supabase.integration.test.ts
import { createClient } from '@supabase/supabase-js'

// Estos tests requieren Supabase real (local o remoto)
describe('Supabase Integration', () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  it('puede crear y leer un proyecto', async () => {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ name: 'Test Project', created_by: 'test-user' })
      .select()
      .single()
    
    expect(error).toBeNull()
    expect(project.name).toBe('Test Project')
    
    // Cleanup
    await supabase.from('projects').delete().eq('id', project.id)
  })
})
```

---

## 🤖 4. Evaluación de IA (LLM Eval)

```typescript
// test/eval/llm-eval.ts
// Tests de evaluación con LLM real (se ejecutan periódicamente, no en CI)

interface EvalCase {
  name: string
  input: string
  expectedBehaviors: string[]
  forbiddenPatterns?: string[]
}

const EVAL_CASES: EvalCase[] = [
  {
    name: 'Pregunta sobre presupuesto',
    input: 'Necesito ayuda con el presupuesto de mi proyecto',
    expectedBehaviors: [
      'pregunta por costos',
      'menciona inversión',
      'pide desglose',
    ],
    forbiddenPatterns: [
      'inventar cifras',
    ],
  },
  {
    name: 'Solicitud de normativa',
    input: '¿Qué leyes aplican a mi restaurante?',
    expectedBehaviors: [
      'menciona normativa sanitaria',
      'pregunta por ubicación',
      'sugiere consultar entidad',
    ],
  },
]

export async function runLLMEvaluation() {
  const results = []
  
  for (const testCase of EVAL_CASES) {
    const response = await callGemini(testCase.input)
    
    const passed = testCase.expectedBehaviors.every(
      behavior => response.toLowerCase().includes(behavior.toLowerCase())
    )
    
    const forbidden = testCase.forbiddenPatterns?.some(
      pattern => response.toLowerCase().includes(pattern.toLowerCase())
    )
    
    results.push({
      name: testCase.name,
      passed: passed && !forbidden,
      response: response.slice(0, 200),
    })
  }
  
  return results
}

// Ejecutar: npx tsx test/eval/llm-eval.ts
```

---

## 🌐 5. Tests E2E (Playwright)

```typescript
// apps/web/e2e/create-project.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Flujo completo: Crear proyecto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('usuario puede crear un proyecto y chatear con KAIZEN', async ({ page }) => {
    // 1. Crear proyecto
    await page.click('text=Nuevo Proyecto')
    await page.fill('[name="name"]', 'Restaurante Sostenible')
    await page.click('button:has-text("Crear")')
    
    // 2. Ver chat de KAIZEN
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible()
    
    // 3. Enviar mensaje
    await page.fill('[data-testid="chat-input"]', 'Quiero crear un restaurante en Medellín')
    await page.click('[data-testid="send-button"]')
    
    // 4. Esperar respuesta de KAIZEN (streaming)
    await expect(page.locator('[data-testid="assistant-message"]')).toBeVisible({ timeout: 15000 })
    
    // 5. Verificar botón de exportar
    await expect(page.locator('text=Exportar')).toBeVisible()
  })

  test('proyecto puede exportarse a PDF', async ({ page }) => {
    // Navegar a proyecto existente
    await page.click('text=Restaurante Sostenible')
    
    // Click exportar
    await page.click('text=Exportar')
    await page.click('text=PDF')
    
    // Verificar descarga
    const download = await page.waitForEvent('download')
    expect(download.suggestedFilename()).toContain('.pdf')
  })
})
```

---

## 📊 6. Cobertura de Tests por Componente

| Componente | Unit | Integration | E2E | Eval |
|-----------|------|-------------|-----|------|
| UI Components | ✅ 90% | — | ✅ Flujos clave | — |
| API Routes | ✅ 85% | ✅ 80% | — | — |
| Discovery Engine | ✅ 95% | ✅ 80% | ✅ | ✅ |
| RAG Pipeline | ✅ 90% | ✅ 75% | — | ✅ |
| Agentes | ✅ 85% | ✅ 70% | — | ✅ |
| Exportación | ✅ 90% | ✅ 85% | ✅ | — |
| Convocatorias | ✅ 85% | ✅ 80% | — | — |
| Database | — | ✅ 90% | — | — |

---

## 🔄 CI/CD Pipeline de Tests

```yaml
# .github/workflows/test.yml
name: Quality Gate

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-and-typecheck:
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
      
      - name: Unit tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  integration:
    runs-on: ubuntu-latest
    services:
      supabase:
        image: supabase/supabase-local:latest
        ports:
          - 54321:54321
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          NEXT_PUBLIC_SUPABASE_URL: http://localhost:54321
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  llm-eval:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run LLM evaluation
        run: npm run test:eval
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

---

## ✅ Definition of Done para Testing

- [ ] Vitest configurado con cobertura > 80%
- [ ] Componentes React tienen tests con Testing Library
- [ ] Funciones de negocio tienen tests unitarios
- [ ] LLM mocking implementado para tests
- [ ] API Routes tienen tests de integración
- [ ] Tests E2E con Playwright para flujos críticos
- [ ] Evaluación de IA periódica (GitHub Actions semanal)
- [ ] CI/CD ejecuta tests automáticamente
- [ ] Reporte de cobertura visible en cada PR

---

> **Ver también:** [09_GETTING_STARTED.md](09_GETTING_STARTED.md) — Cómo ejecutar tests localmente

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
