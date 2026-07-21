'use client'

import { useState, useCallback } from 'react'
import { Search, BookOpen, Loader2, FileText, Upload, Sparkles } from 'lucide-react'
import type { SearchResult } from '@/lib/knowledge/types'

export default function KnowledgePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [confidence, setConfidence] = useState(0)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          limit: 10,
          threshold: 0.5,
        }),
      })

      if (!response.ok) throw new Error('Error en la búsqueda')

      const data = await response.json()
      setResults(data.results || [])
      setConfidence(data.context?.confidence || 0)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const categories = [
    { name: 'Metodología KAIZEN', icon: '📋', articles: 12, domain: 'metodologico' },
    { name: 'Marco Lógico', icon: '🎯', articles: 8, domain: 'metodologico' },
    { name: 'MGA', icon: '📊', articles: 15, domain: 'metodologico' },
    { name: 'Normatividad', icon: '⚖️', articles: 20, domain: 'normativo' },
    { name: 'Fondo Emprender', icon: '💰', articles: 6, domain: 'convocatorias' },
    { name: 'iNNpulsa', icon: '🚀', articles: 4, domain: 'convocatorias' },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Base de Conocimiento</h1>
        <p className="text-muted-foreground">
          Búsqueda semántica con IA en documentos, metodologías y normativas
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar en la base de conocimiento (ej: 'cómo estructurar un presupuesto', 'requisitos Fondo Emprender')..."
          className="w-full rounded-xl border bg-background py-4 pl-12 pr-4 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Buscar'
          )}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border bg-card p-5">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-3 w-full rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {/* Confidence indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className={`h-4 w-4 ${confidence > 0.7 ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>
                  Confianza de la búsqueda: <strong className="text-foreground">{(confidence * 100).toFixed(0)}%</strong>
                </span>
                <span className="text-muted-foreground">·</span>
                <span>{results.length} resultado(s)</span>
              </div>

              {results.map((result, i) => (
                <div
                  key={result.id}
                  className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                        {result.domain || 'general'}
                      </span>
                      <span>·</span>
                      <span>Confianza: {(result.similarity * 100).toFixed(0)}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      #{i + 1}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-4">
                    {result.content}
                  </p>
                  {result.metadata && (result.metadata as any).source && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Fuente: {(result.metadata as any).source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-12 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Sin resultados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se encontraron resultados para tu búsqueda. Prueba con otros términos
                o ingesta documentos en la base de conocimiento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Categories (when no search yet) */}
      {!searched && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Categorías</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => {
                  setQuery(cat.name)
                  setTimeout(() => handleSearch(), 100)
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {cat.articles} artículos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-6 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          <span>🔍 Búsqueda híbrida (vectorial + texto completo)</span>
          <span>📐 768 dimensiones</span>
          <span>🎯 RRF Ranking</span>
        </div>
      )}
    </div>
  )
}
