import { createClient } from '@/lib/supabase/server'
import { chunkDocument, countTokens } from './chunking'
import { generateEmbeddingsBatch } from './embeddings'
import type { IngestedDocument, KnowledgeChunk } from '../types'

/**
 * Pipeline completo de ingesta de documentos.
 * 1. Chunking inteligente
 * 2. Embeddings con Gemini
 * 3. Almacenamiento en pgvector
 */
export async function ingestDocument(
  title: string,
  content: string,
  source: string,
  options?: {
    organizationId?: string
    domain?: string
    metadata?: Record<string, unknown>
  },
): Promise<IngestedDocument> {
  // 1. Chunking
  const chunks = await chunkDocument(content, source)
  
  // 2. Generar embeddings para cada chunk
  const chunkTexts = chunks.map((c) => c.content)
  const embeddings = await generateEmbeddingsBatch(chunkTexts)
  
  // 3. Asignar embeddings a los chunks
  const embeddedChunks = chunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }))

  // 4. Almacenar en Supabase
  const supabase = await createClient()
  const knowledgeChunks: Omit<KnowledgeChunk, 'id' | 'created_at'>[] = embeddedChunks.map(
    (chunk) => ({
      organization_id: options?.organizationId || '',
      content: chunk.content,
      embedding: chunk.embedding,
      metadata: {
        ...chunk.metadata,
        ...options?.metadata,
        title,
      },
      domain: options?.domain || 'general',
      confidence: 0.8,
      token_count: countTokens(chunk.content),
    }),
  )

  if (knowledgeChunks.length > 0 && options?.organizationId) {
    const { error } = await supabase.from('knowledge_chunks').insert(knowledgeChunks)
    if (error) {
      console.error('Error storing chunks:', error)
    }
  }

  return {
    id: crypto.randomUUID(),
    title,
    content,
    source,
    type: source.split('.').pop() || 'unknown',
    domain: options?.domain || 'general',
    metadata: options?.metadata || {},
    chunks: knowledgeChunks.map((c, i) => ({
      id: `chunk-${i}`,
      organization_id: c.organization_id,
      content: c.content,
      embedding: c.embedding,
      metadata: c.metadata,
      domain: c.domain,
      confidence: c.confidence,
      token_count: c.token_count,
      created_at: new Date().toISOString(),
    })),
  }
}
