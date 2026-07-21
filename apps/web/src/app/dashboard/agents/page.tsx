'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CollaborationBoard } from '@/components/agents/collaboration-board'
import { Bot, Loader2 } from 'lucide-react'
import type { Project } from '@/types'

export default function AgentsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10)

      setProjects(data ?? [])
      if (data && data.length > 0) {
        setSelectedProject(data[0]!)
      }
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Consejo Estratégico</h1>
        <p className="text-muted-foreground">
          7 agentes de IA especializados trabajando en equipo para tu proyecto
        </p>
      </div>

      {/* Project selector */}
      {projects.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium shrink-0">Proyecto:</label>
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const project = projects.find((p) => p.id === e.target.value)
              setSelectedProject(project || null)
            }}
            className="max-w-md rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* No projects state */}
      {projects.length === 0 && (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Crea un proyecto primero</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Necesitas al menos un proyecto para que el Consejo Estratégico pueda analizarlo.
            Ve a la sección de proyectos y crea uno nuevo.
          </p>
        </div>
      )}

      {/* Collaboration Board */}
      {selectedProject && (
        <CollaborationBoard
          projectData={{
            id: selectedProject.id,
            name: selectedProject.name,
            description: selectedProject.description,
            methodology: selectedProject.methodology,
            target_entity: selectedProject.target_entity,
            country: selectedProject.country,
          }}
        />
      )}

      {/* Team overview */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">El Equipo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { name: 'Director Estratégico', role: 'strategic', icon: '🎯', desc: 'Planeación, marco lógico, objetivos SMART' },
            { name: 'Director Financiero', role: 'financial', icon: '💰', desc: 'VAN/TIR/ROI, flujo de caja, presupuesto' },
            { name: 'Director Jurídico', role: 'legal', icon: '⚖️', desc: 'Normativa colombiana, permisos, contratos' },
            { name: 'Director Comercial', role: 'commercial', icon: '📊', desc: 'Estudio de mercado, competencia, ventas' },
            { name: 'Director Investigación', role: 'research', icon: '🔬', desc: 'Estado del arte, I+D+i, benchmarking' },
            { name: 'Director Convocatorias', role: 'calls', icon: '📋', desc: 'Oportunidades de financiación, matching' },
            { name: 'Director Riesgos', role: 'risks', icon: '⚠️', desc: 'ISO 31000, matriz de riesgos, mitigación' },
          ].map((agent) => (
            <div key={agent.role} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
              <span className="text-xl">{agent.icon}</span>
              <div>
                <p className="text-sm font-medium">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
