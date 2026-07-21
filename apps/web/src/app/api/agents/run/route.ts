import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runAgentSystem } from '@/lib/agents'
import type { AgentRole, AgentRunRequest } from '@/lib/agents/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body: AgentRunRequest = await request.json()
    const { projectId, projectData, agents } = body

    if (!projectData) {
      return NextResponse.json({ error: 'Datos del proyecto requeridos' }, { status: 400 })
    }

    // Verificar que el proyecto pertenece al usuario
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('created_by', user.id)
        .single()

      if (!project) {
        return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
      }
    }

    // Ejecutar el sistema de agentes
    const state = await runAgentSystem(
      {
        id: projectId || 'new',
        name: projectData.name,
        description: projectData.description,
        methodology: projectData.methodology,
        target_entity: projectData.target_entity,
        country: projectData.country,
        metadata: projectData.metadata || {},
      },
      (agents as AgentRole[] | undefined),
    )

    // Guardar resultados en Supabase si hay un projectId
    if (projectId) {
      const agentResults = state.agentResults
      
      // Guardar cada resultado en la tabla de conversaciones
      const conversationEntries = Object.entries(agentResults)
        .filter(([_, result]) => result?.content)
        .map(([role, result]) => ({
          project_id: projectId,
          role: 'assistant' as const,
          content: result!.content || '',
          metadata: {
            agent: role,
            type: 'agent_analysis',
            confidence: result!.confidence,
            summary: result!.summary,
          },
        }))

      if (conversationEntries.length > 0) {
        const { error: convError } = await supabase
          .from('conversations')
          .insert(conversationEntries)

        if (convError) {
          console.error('Error saving agent results:', convError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      state: {
        currentPhase: state.currentPhase,
        agentResults: state.agentResults,
        decisionLog: state.decisionLog,
        errors: state.errors,
      },
    })
  } catch (error) {
    console.error('Error running agents:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    )
  }
}
