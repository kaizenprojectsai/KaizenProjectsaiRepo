import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hybridSearch } from '@/lib/knowledge/retrieval/vector-search'
import { buildContextFromResults } from '@/lib/knowledge/retrieval/context-assembly'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { query, limit, threshold, domain } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Consulta requerida' }, { status: 400 })
    }

    // Obtener organization_id del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    // Búsqueda híbrida
    const results = await hybridSearch(query, {
      organizationId: profile?.organization_id || undefined,
      limit: limit || 10,
      threshold: threshold || 0.5,
      domain,
    })

    // Ensamblar contexto
    const context = buildContextFromResults(query, results)

    return NextResponse.json({
      results,
      context: {
        chunks: context.chunks,
        confidence: context.confidence,
        totalResults: results.length,
      },
    })
  } catch (error) {
    console.error('Knowledge search error:', error)
    return NextResponse.json(
      { error: 'Error al buscar en la base de conocimiento' },
      { status: 500 },
    )
  }
}
