export interface KnowledgeChunk {
  id: string
  organization_id: string
  document_id?: string
  content: string
  embedding?: number[]
  metadata: Record<string, unknown>
  domain?: string
  confidence: number
  token_count: number
  created_at: string
}

export interface SearchResult {
  id: string
  content: string
  metadata: Record<string, unknown>
  similarity: number
  domain?: string
  confidence: number
}

export interface RAGContext {
  chunks: Array<{
    content: string
    similarity: number
    source: string
    domain: string
  }>
  confidence: number
  query: string
}

export interface IngestedDocument {
  id: string
  title: string
  content: string
  source: string
  type: string
  domain: string
  metadata: Record<string, unknown>
  chunks: KnowledgeChunk[]
}

export interface DocumentChunk {
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

export interface GraphNode {
  id: string
  type: 'project' | 'document' | 'concept' | 'entity' | 'regulation' | 'call'
  label: string
  properties: Record<string, unknown>
  embedding?: number[]
}

export interface GraphEdge {
  source: string
  target: string
  type: 'relates_to' | 'depends_on' | 'references' | 'implements' | 'contains'
  weight: number
  metadata: Record<string, unknown>
}

export interface ClassifiedDocument {
  domain: string
  subdomain: string
  confidence: number
  tags: string[]
  entities: string[]
}

export interface MemoryEntry {
  id: string
  type: 'lesson_learned' | 'best_practice' | 'common_mistake' | 'success_pattern'
  content: string
  projectId: string
  tags: string[]
  embedding?: number[]
  created_at: string
}
