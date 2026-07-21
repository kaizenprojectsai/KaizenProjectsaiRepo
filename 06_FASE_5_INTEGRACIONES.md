# 🔌 FASE 5: INTEGRACIONES & MARKETPLACE — El Ecosistema Completo

> **Duración:** Semanas 17-24  
> **Objetivo:** Convocatorias reales, formatos oficiales, exportación profesional y ecosistema de extensiones  
> **Costo:** $0/mes

---

## 🎯 Objetivo de la Fase

Convertir KAIZEN en una plataforma útil para casos reales: conectada con convocatorias colombianas, capaz de generar formatos oficiales (MGA, Fondo Emprender) y extensible por la comunidad.

---

## 📋 Checklist

- [ ] **Paso 1:** Base de datos de Convocatorias Colombianas
- [ ] **Paso 2:** Motor de compatibilidad con convocatorias
- [ ] **Paso 3:** Formatos oficiales (MGA, Fondo Emprender, SENA)
- [ ] **Paso 4:** Exportación profesional (PDF, Docx, Excel, PPT)
- [ ] **Paso 5:** APIs Públicas REST
- [ ] **Paso 6:** Dashboard Analítico
- [ ] **Paso 7:** Marketplace de Skills y Plugins
- [ ] **Paso 8:** Internacionalización (i18n)

---

## 🏛️ Paso 1: Base de Convocatorias Colombianas

```sql
-- Tabla de entidades
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sector TEXT,
  country TEXT DEFAULT 'Colombia',
  website TEXT,
  logo_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de programas
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'seed', 'innovation', 'research', 'business'
  metadata JSONB DEFAULT '{}'
);

-- Tabla de convocatorias
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, closed, upcoming
  opening_date DATE,
  closing_date DATE,
  max_budget NUMERIC,
  min_budget NUMERIC,
  requirements JSONB DEFAULT '[]',
  documents_required JSONB DEFAULT '[]',
  evaluation_criteria JSONB DEFAULT '[]',
  funding_type TEXT, -- 'grant', 'loan', 'equity', 'subsidy'
  sectors TEXT[],
  regions TEXT[],
  beneficiaries TEXT[],
  url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_dates ON calls(opening_date, closing_date);
CREATE INDEX idx_calls_sectors ON calls USING GIN(sectors);
CREATE INDEX idx_calls_regions ON calls USING GIN(regions);
```

### Datos Iniciales de Convocatorias

```typescript
// packages/integrations/src/calls/colombia/seed-data.ts

export const COLOMBIAN_ENTITIES = [
  {
    name: 'SENA - Fondo Emprender',
    slug: 'fondo-emprender',
    sector: 'Emprendimiento',
    website: 'https://fondoemprender.com',
    programs: [
      {
        name: 'Capital Semilla',
        type: 'seed',
        description: 'Recursos para creación de empresas',
        calls: [
          {
            name: 'Fondo Emprender 2025',
            max_budget: 200000000, // $200M COP
            min_budget: 5000000,    // $5M COP
            funding_type: 'grant',
            sectors: ['tecnologia', 'agroindustria', 'comercio', 'industria', 'servicios'],
            requirements: ['Plan de negocio', 'Estudio de mercado', 'Análisis financiero'],
            documents_required: ['Formulario inscripción', 'Plan de negocio', 'Estudio financiero'],
          },
        ],
      },
    ],
  },
  {
    name: 'iNNpulsa Colombia',
    slug: 'innpulsa',
    sector: 'Innovación',
    website: 'https://innpulsacolombia.com',
    programs: [
      {
        name: 'Aldea - Aceleración',
        type: 'innovation',
        calls: [
          {
            name: 'Aldea 2025',
            max_budget: 400000000,
            funding_type: 'grant',
            sectors: ['tech', 'health', 'agritech', 'fintech'],
            requirements: ['MVP validado', 'Traction inicial', 'Equipo completo'],
          },
        ],
      },
    ],
  },
  {
    name: 'MinCiencias',
    slug: 'minciencias',
    sector: 'Ciencia y Tecnología',
    website: 'https://minciencias.gov.co',
    programs: [
      {
        name: 'Vocaciones Científicas',
        type: 'research',
        calls: [
          {
            name: 'Jóvenes Investigadores 2025',
            funding_type: 'grant',
            sectors: ['ciencia', 'tecnologia', 'innovacion'],
            requirements: ['Propuesta investigación', 'Hoja de vida', 'Carta aval'],
          },
        ],
      },
    ],
  },
]
```

---

## 🎯 Paso 2: Motor de Compatibilidad

```typescript
// packages/integrations/src/calls/matching-engine.ts

interface CompatibilityScore {
  callId: string
  callName: string
  entity: string
  score: number // 0-100
  breakdown: {
    sector: number
    budget: number
    region: number
    stage: number
    requirements: number
  }
  missingRequirements: string[]
  recommendations: string[]
}

export async function calculateCompatibility(
  project: Project,
  calls: Call[]
): Promise<CompatibilityScore[]> {
  const scores: CompatibilityScore[] = []

  for (const call of calls) {
    // 1. Compatibilidad sectorial
    const sectorScore = calculateSectorMatch(project.sector, call.sectors)
    
    // 2. Compatibilidad presupuestal
    const budgetScore = calculateBudgetMatch(project.budget, call)
    
    // 3. Compatibilidad regional
    const regionScore = calculateRegionMatch(project.region, call.regions)
    
    // 4. Compatibilidad de etapa
    const stageScore = calculateStageMatch(project.stage, call.type)
    
    // 5. Requisitos cumplidos
    const requirementsScore = calculateRequirementsMatch(
      project.documents,
      call.documents_required
    )

    // Puntaje ponderado
    const score = Math.round(
      sectorScore * 0.25 +
      budgetScore * 0.25 +
      regionScore * 0.15 +
      stageScore * 0.15 +
      requirementsScore * 0.20
    )

    scores.push({
      callId: call.id,
      callName: call.name,
      entity: call.entity_name,
      score,
      breakdown: {
        sector: sectorScore,
        budget: budgetScore,
        region: regionScore,
        stage: stageScore,
        requirements: requirementsScore,
      },
      missingRequirements: getMissingRequirements(project, call),
      recommendations: generateRecommendations(project, call, score),
    })
  }

  return scores.sort((a, b) => b.score - a.score)
}

// UI: Ranking visual de convocatorias
export function CallCompatibilityRanking({ scores }: { scores: CompatibilityScore[] }) {
  return (
    <div className="space-y-4">
      {scores.slice(0, 5).map(score => (
        <div key={score.callId} className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{score.callName}</h3>
              <p className="text-sm text-muted-foreground">{score.entity}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${
                score.score >= 80 ? 'text-green-600' :
                score.score >= 60 ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {score.score}%
              </p>
              <p className="text-xs text-muted-foreground">Compatibilidad</p>
            </div>
          </div>
          
          {/* Barras de desglose */}
          <div className="mt-3 space-y-1">
            {Object.entries(score.breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-24 text-xs capitalize">{key}</span>
                <Progress value={value} className="flex-1" />
                <span className="w-8 text-xs text-right">{value}%</span>
              </div>
            ))}
          </div>
          
          {/* Requisitos faltantes */}
          {score.missingRequirements.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-600">Requisitos pendientes:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                {score.missingRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## 📄 Paso 3: Formatos Oficiales

```typescript
// packages/integrations/src/formats/mga/index.ts
// MGA - Metodología General Ajustada (Colombia - DNP)

export const MGA_SCHEMA = {
  name: 'MGA - Metodología General Ajustada',
  version: '3.0',
  entity: 'DNP - Departamento Nacional de Planeación',
  sections: [
    {
      id: 'identificacion',
      title: 'Identificación',
      fields: [
        { key: 'nombre_proyecto', type: 'text', required: true },
        { key: 'entidad', type: 'text', required: true },
        { key: 'sector', type: 'select', options: [
          'Agropecuario', 'Ambiental', 'Ciencia', 'Comercio', 'Cultura',
          'Deporte', 'Educación', 'Energía', 'Gobierno', 'Industria',
          'Minas', 'Planeación', 'Salud', 'TIC', 'Transporte', 'Vivienda',
        ]},
        { key: 'duracion_meses', type: 'number', required: true },
        { key: 'valor_total', type: 'currency', required: true },
      ],
    },
    {
      id: 'cadena_valor',
      title: 'Cadena de Valor',
      fields: [
        { key: 'objetivo_general', type: 'text', required: true },
        { key: 'objetivos_especificos', type: 'list', required: true },
        { key: 'productos', type: 'table', columns: ['producto', 'unidad', 'cantidad', 'valor'] },
        { key: 'actividades', type: 'table', columns: ['actividad', 'producto', 'responsable', 'mes_inicio', 'mes_fin'] },
      ],
    },
    {
      id: 'fuentes_financiacion',
      title: 'Fuentes de Financiación',
      fields: [
        { key: 'fuentes', type: 'table', columns: ['fuente', 'tipo', 'valor_vigente', 'valor_futuro'] },
      ],
    },
    {
      id: 'indicadores',
      title: 'Indicadores',
      fields: [
        { key: 'indicadores_producto', type: 'table', columns: ['nombre', 'formula', 'linea_base', 'meta'] },
        { key: 'indicadores_resultado', type: 'table', columns: ['nombre', 'formula', 'linea_base', 'meta'] },
      ],
    },
  ],
  validation: {
    rules: MGA_VALIDATION_RULES,
    exports: ['mga-xml', 'mga-pdf', 'mga-excel'],
  },
}

// Validaciones específicas MGA
const MGA_VALIDATION_RULES = [
  { rule: 'budget_balance', message: 'El total de fuentes debe igualar el valor del proyecto' },
  { rule: 'min_activities', message: 'Debe tener al menos 3 actividades por producto' },
  { rule: 'indicators_match', message: 'Los indicadores deben corresponder a los objetivos' },
  { rule: 'sector_exists', message: 'El sector debe ser válido según catálogo DNP' },
]
```

---

## 📤 Paso 4: Exportación Profesional

```bash
# Librerías gratuitas para exportación
npm install @react-pdf/renderer   # PDF profesional
npm install docx                  # Word (DOCX)
npm install exceljs              # Excel (XLSX)
npm install pptxgenjs            # PowerPoint (PPTX)
npm install puppeteer            # HTML → PDF (Vercel Edge)
npm install html-to-image        # Exportar diagramas como PNG
```

```typescript
// packages/integrations/src/export/export-manager.ts

interface ExportOptions {
  format: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'html' | 'md'
  template: 'marco-logico' | 'canvas' | 'mga' | 'fondo-emprender' | 'custom'
  includeDiagrams?: boolean
  language?: 'es' | 'en'
  branding?: {
    logo?: string
    colors?: string[]
    company?: string
  }
}

export async function exportProject(
  project: Project,
  options: ExportOptions
): Promise<Blob> {
  switch (options.format) {
    case 'pdf':
      return exportToPDF(project, options)
    case 'docx':
      return exportToDOCX(project, options)
    case 'xlsx':
      return exportToXLSX(project, options)
    case 'pptx':
      return exportToPPTX(project, options)
    case 'md':
      return exportToMarkdown(project, options)
    default:
      return exportToPDF(project, options)
  }
}

// Exportar a múltiples formatos simultáneamente
export async function exportProjectBatch(
  project: Project,
  formats: ExportOptions['format'][]
): Promise<Record<string, Blob>> {
  const results: Record<string, Blob> = {}
  
  await Promise.all(
    formats.map(async format => {
      results[format] = await exportProject(project, { format })
    })
  )
  
  return results
}

// Endpoint de exportación
export async function POST(req: Request) {
  const { projectId, format } = await req.json()
  const project = await getProject(projectId)
  
  const blob = await exportProject(project, { format })
  
  return new Response(blob, {
    headers: {
      'Content-Type': getContentType(format),
      'Content-Disposition': `attachment; filename="${project.name}.${format}"`,
    },
  })
}
```

---

## 🔌 Paso 5: APIs Públicas REST

```typescript
// apps/web/src/app/api/v1/projects/route.ts

// API Pública de KAIZEN
export async function GET(req: Request) {
  // Autenticación API Key
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) return Response.json({ error: 'API Key required' }, { status: 401 })
  
  const projects = await supabase
    .from('projects')
    .select('*')
    .eq('api_key_id', apiKey)
  
  return Response.json(projects)
}

export async function POST(req: Request) {
  // Crear proyecto desde API externa
  const body = await req.json()
  const project = await createProject(body)
  
  return Response.json(project, { status: 201 })
}
```

### API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/projects` | Listar proyectos |
| `POST` | `/api/v1/projects` | Crear proyecto |
| `GET` | `/api/v1/projects/:id` | Obtener proyecto |
| `POST` | `/api/v1/projects/:id/chat` | Enviar mensaje al KDE |
| `GET` | `/api/v1/projects/:id/export/:format` | Exportar proyecto |
| `GET` | `/api/v1/calls` | Listar convocatorias |
| `GET` | `/api/v1/calls/:id/compatibility` | Compatibilidad proyecto-convocatoria |
| `POST` | `/api/v1/knowledge` | Indexar documento |
| `GET` | `/api/v1/knowledge/search` | Buscar en knowledge base |

---

## 📊 Paso 6: Dashboard Analítico

```typescript
// packages/integrations/src/analytics/dashboard.ts

export async function getDashboardMetrics(organizationId: string) {
  const [projects, calls, conversations, documents] = await Promise.all([
    getProjectStats(organizationId),
    getCallMatches(organizationId),
    getConversationStats(organizationId),
    getDocumentStats(organizationId),
  ])

  return {
    // Proyectos
    totalProjects: projects.total,
    projectsByStatus: projects.byStatus,
    completionRate: projects.completionRate,
    averageTimeToComplete: projects.avgTime,

    // Convocatorias
    compatibleCalls: calls.compatible,
    pendingApplications: calls.pending,
    successRate: calls.successRate,

    // Conocimiento
    totalDocuments: documents.total,
    knowledgeCoverage: documents.coverage,
    topDomains: documents.topDomains,

    // Actividad
    activeUsers: conversations.activeUsers,
    messagesToday: conversations.today,
    topAgents: conversations.topAgents,
  }
}

// Componente UI del Dashboard
export function AnalyticsDashboard({ orgId }: { orgId: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tarjetas de métricas */}
      <MetricCard
        title="Proyectos Activos"
        value={metrics.activeProjects}
        trend={metrics.projectsTrend}
        icon={FolderKanban}
      />
      <MetricCard
        title="Compatibilidad Promedio"
        value={`${metrics.avgCompatibility}%`}
        trend={metrics.compatibilityTrend}
        icon={Target}
      />
      <MetricCard
        title="Documentos Indexados"
        value={metrics.totalDocuments}
        trend={metrics.documentsTrend}
        icon={FileText}
      />
      <MetricCard
        title="Conocimiento (KMI)"
        value={`${metrics.knowledgeMaturity}%`}
        trend={metrics.kmiTrend}
        icon={Brain}
      />

      {/* Gráficos */}
      <div className="col-span-full grid gap-4 md:grid-cols-2">
        <ProjectsChart data={metrics.projectsByMonth} />
        <CallsChart data={metrics.callsByEntity} />
      </div>
    </div>
  )
}
```

---

## 🛍️ Paso 7: Marketplace de Skills

```sql
-- Tabla de skills publicables
CREATE TABLE marketplace_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id),
  version TEXT DEFAULT '1.0.0',
  category TEXT,
  tags TEXT[],
  price NUMERIC DEFAULT 0, -- 0 = gratuito
  rating FLOAT DEFAULT 0,
  downloads INT DEFAULT 0,
  content JSONB NOT NULL, -- prompt + configuración
  dependencies JSONB DEFAULT '[]',
  compatibility JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

```typescript
// packages/integrations/src/marketplace/skill-store.ts

interface SkillPackage {
  id: string
  name: string
  description: string
  type: 'skill' | 'prompt' | 'template' | 'workflow' | 'connector'
  prompt: string
  tools: string[]
  config: Record<string, any>
  tags: string[]
}

export async function publishSkill(skill: SkillPackage) {
  // 1. Validar el skill
  const validation = await validateSkill(skill)
  if (!validation.valid) throw new Error(validation.errors.join(', '))
  
  // 2. Registrar en marketplace
  const { data, error } = await supabase
    .from('marketplace_skills')
    .insert({
      name: skill.name,
      slug: slugify(skill.name),
      description: skill.description,
      content: skill,
      tags: skill.tags,
    })
  
  return data
}

export async function installSkill(skillId: string, organizationId: string) {
  // 1. Obtener skill del marketplace
  const skill = await getMarketplaceSkill(skillId)
  
  // 2. Resolver dependencias
  const deps = await resolveDependencies(skill.dependencies)
  
  // 3. Instalar en la organización
  await supabase.from('organization_skills').insert({
    organization_id: organizationId,
    skill_id: skillId,
    config: {},
    is_active: true,
  })
  
  // 4. Incrementar contador de descargas
  await supabase.rpc('increment_skill_downloads', { skill_id: skillId })
}
```

---

## 🌐 Paso 8: Internacionalización (i18n)

```typescript
// packages/i18n/src/config.ts
// Usando: next-intl (gratuito, open source)

export const LOCALES = {
  es: {
    name: 'Español',
    native: 'Español',
    countries: ['CO', 'MX', 'AR', 'CL', 'PE', 'EC', 'UY', 'CR'],
  },
  en: {
    name: 'English',
    native: 'English',
    countries: ['US', 'GB', 'AU', 'CA'],
  },
  pt: {
    name: 'Português',
    native: 'Português',
    countries: ['BR', 'PT'],
  },
} as const

// Traducciones para el Discovery Engine
const DISCOVERY_STRINGS = {
  es: {
    comprehend_question: '¿Cuál es la idea principal de tu proyecto?',
    ask_evidence: '¿Tienes alguna evidencia que respalde esta información?',
    missing_budget: 'Aún no has definido el presupuesto.',
    methodology_recommendation: 'Para tu tipo de proyecto, recomiendo usar {methodology}',
  },
  en: {
    comprehend_question: 'What is the main idea of your project?',
    ask_evidence: 'Do you have any evidence to support this information?',
    missing_budget: 'You haven\'t defined a budget yet.',
    methodology_recommendation: 'For your project type, I recommend using {methodology}',
  },
} as const
```

---

## ✅ Definition of Done — FASE 5

- [ ] Base de datos con 10+ convocatorias colombianas activas
- [ ] Motor de compatibilidad funcional (proyecto → convocatorias)
- [ ] Formato MGA exportable
- [ ] Formato Fondo Emprender exportable
- [ ] Exportación a PDF, DOCX, XLSX, PPTX
- [ ] APIs REST públicas documentadas
- [ ] Dashboard analítico con KPIs
- [ ] Marketplace funcional (publicar + instalar skills)
- [ ] Internacionalización (ES + EN)

---

> **Siguiente documento:** [07_RECURSOS_GRATUITOS.md](07_RECURSOS_GRATUITOS.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
