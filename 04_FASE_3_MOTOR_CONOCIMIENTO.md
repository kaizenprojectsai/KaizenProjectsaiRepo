# 🧠 FASE 3: MOTOR DE CONOCIMIENTO — Knowledge Fabric & RAG

> **Duración:** Semanas 7-10  
> **Objetivo:** KAIZEN aprende de documentos, conversaciones y proyectos anteriores  
> **Costo:** $0/mes (pgvector + Gemini Embeddings gratuitos)

---

## 🏛️ Arquitectura del Conocimiento

```
Documentos (PDF, DOCX, MD, HTML...)
    │
    ▼
┌─────────────────────────────────────┐
│         PIPELINE DE INGESTA         │
│                                     │
│  1. OCR (Tesseract.js)             │
│  2. Limpieza y normalización       │
│  3. Chunking inteligente           │
│  4. Embeddings (Gemini)            │
│  5. Indexación en pgvector         │
│  6. Relaciones en Knowledge Graph  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│      MOTOR DE RECUPERACIÓN (RAG)    │
│                                     │
│  Búsqueda Vectorial                 │
│  + Búsqueda Full-Text               │
│  + Búsqueda Híbrida                 │
│  + Filtrado por Dominio             │
└─────────────────────────────────────┘
    │
    ▼
Agentes → Consultas → Respuestas con Fuentes
```

---

## 📋 Checklist

- [ ] **Paso 1:** Pipeline de ingesta de documentos
- [ ] **Paso 2:** Chunking inteligente
- [ ] **Paso 3:** Embeddings con Gemini API
- [ ] **Paso 4:** Configurar pgvector (búsqueda vectorial)
- [ ] **Paso 5:** Implementar RAG híbrido
- [ ] **Paso 6:** Knowledge Graph básico
- [ ] **Paso 7:** Memoria organizacional
- [ ] **Paso 8:** Clasificación automática de conocimiento

---

## 📥 Paso 1: Pipeline de Ingesta

```typescript
// packages/knowledge/src/ingestion/pipeline.ts

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'

interface IngestedDocument {
  id: string
  title: string
  content: string
  source: string
  type: string
  domain: string
  metadata: Record<string, any>
  chunks: DocumentChunk[]
}

// Soporte para múltiples formatos
export async function ingestDocument(file: File): Promise<IngestedDocument> {
  const loader = getLoader(file)
  const docs = await loader.load()
  
  // 1. Limpieza
  const cleaned = cleanDocument(docs[0].pageContent)
  
  // 2. Chunking
  const chunks = await chunkDocument(cleaned)
  
  // 3. Clasificación automática
  const classification = await classifyDocument(cleaned)
  
  // 4. Embeddings
  const embeddedChunks = await embedChunks(chunks)
  
  // 5. Almacenar en pgvector
  await storeChunks(embeddedChunks, classification)
  
  // 6. Indexar en Knowledge Graph
  await indexInGraph(classification, chunks)
  
  return {
    id: crypto.randomUUID(),
    title: file.name,
    content: cleaned,
    source: file.name,
    type: file.type,
    domain: classification.domain,
    metadata: classification,
    chunks: embeddedChunks,
  }
}

function getLoader(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf': return new PDFLoader(file)
    case 'docx': return new DocxLoader(file)
    case 'csv': return new CSVLoader(file)
    case 'md':
    case 'txt':
    default: return new TextLoader(file)
  }
}
```

---

## ✂️ Paso 2: Chunking Inteligente

```typescript
// packages/knowledge/src/ingestion/chunking.ts

interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    page?: number
    section?: string
    heading?: string
    position: number
  }
  embedding?: number[]
}

export async function chunkDocument(text: string): Promise<DocumentChunk[]> {
  // Estrategia: chunking semántico respetando estructura
  
  // 1. Dividir por secciones (títulos Markdown, párrafos)
  const sections = text.split(/\n#{1,3}\s+/)
  
  const chunks: DocumentChunk[] = []
  
  for (const [index, section] of sections.entries()) {
    // 2. Si la sección es muy larga (>1000 tokens), subdividir
    if (countTokens(section) > 1000) {
      const subChunks = splitByParagraphs(section, 500) // 500 tokens por chunk
      for (const [subIndex, subChunk] of subChunks.entries()) {
        chunks.push({
          id: `chunk-${index}-${subIndex}`,
          content: subChunk,
          metadata: {
            source: '',
            section: section.slice(0, 50).trim(),
            position: index,
          },
        })
      }
    } else {
      chunks.push({
        id: `chunk-${index}`,
        content: section,
        metadata: {
          section: section.slice(0, 50).trim(),
          position: index,
        },
      })
    }
  }
  
  return chunks
}

// Chunking recursivo para documentos muy grandes
export function recursiveCharacterTextSplitter(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  if (text.length <= chunkSize) return [text]
  
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    let end = start + chunkSize
    
    // Tratar de cortar en límite de párrafo
    if (end < text.length) {
      const lastBreak = text.lastIndexOf('\n\n', end)
      if (lastBreak > start) end = lastBreak
    }
    
    chunks.push(text.slice(start, end))
    start = end - overlap // overlapping para mantener contexto
  }
  
  return chunks
}

function countTokens(text: string): number {
  // Estimación simple: ~4 caracteres por token
  return Math.ceil(text.length / 4)
}
```

---

## 🔢 Paso 3: Embeddings con Gemini

```typescript
// packages/knowledge/src/embeddings/gemini-embeddings.ts

// Gemini Embeddings API - GRATIS
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/embedding-001',
        content: { parts: [{ text }] },
      }),
    }
  )

  const data = await response.json()
  return data.embedding.values // 768 dimensiones
}

// Embeddings batch
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize = 10
): Promise<number[][]> {
  const batches = []
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const embeddings = await Promise.all(batch.map(generateEmbedding))
    batches.push(...embeddings)
  }
  return batches
}
```

---

## 🗄️ Paso 4: pgvector - Búsqueda Vectorial

```sql
-- Configurar pgvector en Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla para chunks con embeddings
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  document_id UUID,
  content TEXT NOT NULL,
  embedding VECTOR(768), -- Gemini embedding-001
  metadata JSONB DEFAULT '{}',
  domain TEXT,
  confidence FLOAT DEFAULT 0.0,
  token_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices vectoriales
CREATE INDEX idx_knowledge_chunks_embedding 
  ON knowledge_chunks 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Búsqueda híbrida (vectorial + texto completo)
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding VECTOR(768),
  query_text TEXT,
  match_threshold FLOAT,
  match_count INT,
  org_id UUID
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT,
  domain TEXT,
  confidence FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity,
    kc.domain,
    kc.confidence
  FROM knowledge_chunks kc
  WHERE 
    kc.organization_id = org_id
    AND (1 - (kc.embedding <=> query_embedding) > match_threshold)
    AND (
      query_text IS NULL 
      OR kc.content ILIKE '%' || query_text || '%'
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

```typescript
// packages/knowledge/src/retrieval/vector-search.ts

import { createClient } from '@supabase/supabase-js'

export async function vectorSearch(
  query: string,
  organizationId: string,
  options: {
    limit?: number
    threshold?: number
    domain?: string
  } = {}
) {
  const embedding = await generateEmbedding(query)
  
  const { data, error } = await supabase.rpc('search_knowledge', {
    query_embedding: embedding,
    query_text: query,
    match_threshold: options.threshold || 0.7,
    match_count: options.limit || 10,
    org_id: organizationId,
  })
  
  return data
}
```

---

## 🔍 Paso 5: RAG Híbrido

```typescript
// packages/knowledge/src/rag/hybrid-rag.ts

interface RAGContext {
  chunks: Array<{
    content: string
    similarity: number
    source: string
    domain: string
  }>
  confidence: number
  query: string
}

export async function retrieveContext(
  query: string,
  organizationId: string,
  options: {
    strategy?: 'vector' | 'hybrid' | 'graph'
    limit?: number
    threshold?: number
  } = {}
): Promise<RAGContext> {
  // 1. Búsqueda vectorial
  const vectorResults = await vectorSearch(query, organizationId, {
    limit: options.limit || 10,
    threshold: options.threshold || 0.6,
  })
  
  // 2. Búsqueda full-text (PostgreSQL tsvector)
  const textResults = await fullTextSearch(query, organizationId, {
    limit: 5,
  })
  
  // 3. Fusionar resultados (hybrid search)
  const merged = mergeResults(vectorResults, textResults)
  
  return {
    chunks: merged.map(r => ({
      content: r.content,
      similarity: r.similarity,
      source: r.metadata?.source || 'unknown',
      domain: r.domain || 'general',
    })),
    confidence: merged.length > 0 
      ? merged.reduce((acc, r) => acc + r.similarity, 0) / merged.length
      : 0,
    query,
  }
}

// Full-text search con PostgreSQL
async function fullTextSearch(
  query: string,
  organizationId: string,
  options: { limit?: number }
) {
  const { data } = await supabase
    .from('knowledge_chunks')
    .select('*')
    .eq('organization_id', organizationId)
    .textSearch('content', query, {
      type: 'websearch',
      config: 'spanish',
    })
    .limit(options.limit || 5)
  
  return data || []
}

// Merge de resultados con Reciprocal Rank Fusion
function mergeResults(vector: any[], text: any[]) {
  const scores = new Map<string, number>()
  
  vector.forEach((r, i) => {
    scores.set(r.id, (scores.get(r.id) || 0) + 1 / (60 + i))
  })
  
  text.forEach((r, i) => {
    scores.set(r.id, (scores.get(r.id) || 0) + 1 / (60 + i))
  })
  
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => vector.find(r => r.id === id) || text.find(r => r.id === id))
}
```

### Context Assembly para LLM

```typescript
// packages/knowledge/src/rag/context-assembly.ts

export function buildPromptWithContext(
  userMessage: string,
  context: RAGContext
): string {
  const contextBlock = context.chunks
    .map((chunk, i) => `[Fuente ${i + 1}] (Confianza: ${(chunk.similarity * 100).toFixed(0)}%)
${chunk.content}
(Dominio: ${chunk.domain})`)
    .join('\n\n')

  return `
Eres KAIZEN, un experto en formulación de proyectos.

CONTEXTO RELEVANTE:
${contextBlock}

Confianza general del contexto: ${(context.confidence * 100).toFixed(0)}%

INSTRUCCIONES:
- Usa el contexto proporcionado para responder
- Siempre cita las fuentes que uses
- Si el contexto no es suficiente para responder, dilo explícitamente
- No inventes información que no esté en el contexto

MENSAJE DEL USUARIO:
${userMessage}

RESPUESTA (cita las fuentes usadas como [Fuente 1], [Fuente 2], etc.):
`
}
```

---

## 🔗 Paso 6: Knowledge Graph Básico

```typescript
// packages/knowledge/src/graph/knowledge-graph.ts

interface GraphNode {
  id: string
  type: 'project' | 'document' | 'concept' | 'entity' | 'regulation' | 'call'
  label: string
  properties: Record<string, any>
  embedding?: number[]
}

interface GraphEdge {
  source: string
  target: string
  type: 'relates_to' | 'depends_on' | 'references' | 'implements' | 'contains'
  weight: number
  metadata: Record<string, any>
}

// Extraer entidades con Gemini
export async function extractEntities(text: string): Promise<GraphNode[]> {
  const response = await geminiModel.generateContent(`
    Extrae todas las entidades importantes de este texto.
    Clasifícalas en: proyecto, documento, concepto, entidad, regulación, convocatoria.
    
    Texto: ${text.slice(0, 3000)}
    
    Responde SOLO con JSON array:
    [{ "type": "concept", "label": "nombre", "properties": {} }]
  `)
  
  return JSON.parse(response.response.text())
}

// Construir relaciones
export async function buildRelationships(
  nodes: GraphNode[]
): Promise<GraphEdge[]> {
  const edges: GraphEdge[] = []
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Detectar relación por co-ocurrencia o similitud semántica
      const similarity = await cosineSimilarity(
        nodes[i].embedding!,
        nodes[j].embedding!
      )
      
      if (similarity > 0.7) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          type: 'relates_to',
          weight: similarity,
          metadata: {},
        })
      }
    }
  }
  
  return edges
}
```

---

## 💭 Paso 7: Memoria Organizacional

```typescript
// packages/knowledge/src/memory/organizational-memory.ts

interface MemoryEntry {
  id: string
  type: 'lesson_learned' | 'best_practice' | 'common_mistake' | 'success_pattern'
  content: string
  projectId: string
  tags: string[]
  embedding: number[]
  created_at: Date
}

// Extraer lecciones aprendidas al finalizar un proyecto
export async function extractLessons(projectId: string): Promise<MemoryEntry[]> {
  const project = await getProject(projectId)
  const conversations = await getConversations(projectId)
  
  const response = await geminiModel.generateContent(`
    Analiza este proyecto y su conversación. Extrae:
    1. Lecciones aprendidas
    2. Buenas prácticas identificadas
    3. Errores comunes que se evitaron
    4. Patrones de éxito

    Proyecto: ${JSON.stringify(project)}
    Conversación: ${JSON.stringify(conversations.slice(-50))}

    Responde SOLO con JSON array de lecciones.
  `)

  return parseMemoryEntries(response.response.text(), projectId)
}

// Consultar memoria organizacional
export async function queryOrganizationalMemory(
  query: string,
  organizationId: string
): Promise<MemoryEntry[]> {
  const embedding = await generateEmbedding(query)
  
  const { data } = await supabase.rpc('search_organizational_memory', {
    query_embedding: embedding,
    org_id: organizationId,
    match_count: 5,
  })
  
  return data
}
```

---

## 🏷️ Paso 8: Clasificación Automática

```typescript
// packages/knowledge/src/classification/auto-classify.ts

const DOMAINS = [
  'financiero',
  'juridico',
  'tecnico',
  'comercial',
  'ambiental',
  'social',
  'metodologico',
  'convocatorias',
  'normativo',
  'investigacion',
] as const

export async function classifyDocument(text: string): Promise<{
  domain: string
  subdomain: string
  confidence: number
  tags: string[]
  entities: string[]
}> {
  const response = await geminiModel.generateContent(`
    Clasifica el siguiente texto en las categorías de KAIZEN.
    
    Dominios disponibles: ${DOMAINS.join(', ')}
    
    Texto: ${text.slice(0, 2000)}
    
    Responde SOLO con JSON:
    {
      "domain": "financiero",
      "subdomain": "presupuesto",
      "confidence": 0.95,
      "tags": ["inversion", "costos"],
      "entities": ["DNP", "MGA"]
    }
  `)

  return JSON.parse(response.response.text())
}
```

---

## 📊 Monitoreo del Conocimiento

```typescript
// packages/knowledge/src/monitoring/knowledge-stats.ts

export async function getKnowledgeStats(organizationId: string) {
  const { data } = await supabase
    .from('knowledge_chunks')
    .select('domain, confidence, count(*)', { count: 'exact' })
    .eq('organization_id', organizationId)

  return {
    totalChunks: data?.length || 0,
    byDomain: groupBy(data || [], 'domain'),
    averageConfidence: calculateAverage(data || [], 'confidence'),
    coverageScore: calculateCoverage(data || []),
  }
}

// Índice de Madurez del Conocimiento (KMI)
export function calculateKMI(stats: KnowledgeStats): number {
  const weights = {
    coverage: 0.3,
    confidence: 0.3,
    recency: 0.2,
    completeness: 0.2,
  }
  
  return (
    weights.coverage * stats.coverageScore +
    weights.confidence * stats.averageConfidence +
    weights.recency * stats.recencyScore +
    weights.completeness * stats.completenessScore
  )
}
```

---

## ✅ Definition of Done — FASE 3

- [ ] Pipeline de ingesta funcional (PDF, DOCX, MD, TXT, CSV)
- [ ] Chunking inteligente con overlap semántico
- [ ] Embeddings generados con Gemini API
- [ ] Búsqueda vectorial en pgvector (< 500ms)
- [ ] Búsqueda híbrida (vector + full-text)
- [ ] RAG integrado con el chat de KAIZEN
- [ ] Knowledge Graph con entidades y relaciones
- [ ] Memoria organizacional (lecciones aprendidas)
- [ ] Clasificación automática de documentos
- [ ] Las respuestas citan fuentes verificables
- [ ] Índice de Confianza del Conocimiento (KTS)

---

## 📊 Métricas del Conocimiento

| Métrica | Objetivo |
|---------|----------|
| Tiempo de recuperación RAG | < 500ms |
| Precisión de búsqueda | > 85% |
| Confianza promedio del conocimiento | > 0.75 |
| Cobertura por dominio | > 80% |
| Documentos indexados (beta) | > 500 |
| Tasa de citación en respuestas | > 90% |

---

> **Siguiente fase:** [05_FASE_4_SISTEMA_MULTIAGENTE.md](05_FASE_4_SISTEMA_MULTIAGENTE.md)

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
