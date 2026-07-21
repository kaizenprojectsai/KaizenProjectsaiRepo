import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '../ingestion/embeddings'
import type { SearchResult } from '../types'

/**
 * Búsqueda vectorial pura en pgvector.
 */
export async function vectorSearch(
  query: string,
  options: {
    organizationId?: string
    limit?: number
    threshold?: number
    domain?: string
  } = {},
): Promise<SearchResult[]> {
  const supabase = await createClient()
  const embedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('search_knowledge', {
    query_embedding: embedding,
    query_text: query,
    match_threshold: options.threshold || 0.6,
    match_count: options.limit || 10,
    org_id: options.organizationId || null,
    filter_domain: options.domain || null,
  })

  if (error) {
    console.error('Vector search error:', error)
    return []
  }

  return (data || []) as SearchResult[]
}

/**
 * Búsqueda full-text con PostgreSQL tsvector.
 */
export async function fullTextSearch(
  query: string,
  options: {
    organizationId?: string
    limit?: number
    domain?: string
  } = {},
): Promise<SearchResult[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_knowledge_text', {
    query_text: query,
    match_count: options.limit || 5,
    org_id: options.organizationId || null,
    filter_domain: options.domain || null,
  })

  if (error) {
    console.error('Full-text search error:', error)
    return []
  }

  return (data || []).map((r: any) => ({
    ...r,
    similarity: r.rank || 0,
  })) as SearchResult[]
}

/**
 * Búsqueda híbrida combinando vectorial + full-text con RRF.
 */
export async function hybridSearch(
  query: string,
  options: {
    organizationId?: string
    limit?: number
    threshold?: number
    domain?: string
  } = {},
): Promise<SearchResult[]> {
  const [vectorResults, textResults] = await Promise.all([
    vectorSearch(query, { ...options, limit: options.limit || 10 }),
    fullTextSearch(query, { ...options, limit: 5 }),
  ])

  // Reciprocal Rank Fusion (RRF)
  const scores = new Map<string, { result: SearchResult; score: number }>()

  vectorResults.forEach((r, i) => {
    const existing = scores.get(r.id) || { result: r, score: 0 }
    existing.score += 1 / (60 + i)
    scores.set(r.id, existing)
  })

  textResults.forEach((r, i) => {
    const existing = scores.get(r.id) || { result: r, score: 0 }
    existing.score += 1 / (60 + i)
    scores.set(r.id, existing)
  })

  return Array.from(scores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, options.limit || 10)
    .map(([_, { result }]) => result)
}
