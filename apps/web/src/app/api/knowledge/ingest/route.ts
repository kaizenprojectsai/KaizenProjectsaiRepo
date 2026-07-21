import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ingestDocument } from '@/lib/knowledge/ingestion/pipeline'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { title, content, source, domain } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido requeridos' },
        { status: 400 },
      )
    }

    // Obtener organización del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    // Pipeline de ingesta
    const result = await ingestDocument(title, content, source || 'manual', {
      organizationId: profile?.organization_id,
      domain: domain || 'general',
      metadata: {
        ingested_by: user.id,
        source_type: 'api',
      },
    })

    return NextResponse.json({
      success: true,
      document: {
        id: result.id,
        title: result.title,
        domain: result.domain,
        chunksCount: result.chunks.length,
      },
    })
  } catch (error) {
    console.error('Knowledge ingest error:', error)
    return NextResponse.json(
      { error: 'Error al ingestar el documento' },
      { status: 500 },
    )
  }
}
