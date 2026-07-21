'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  BarChart3,
  AlertTriangle,
  Settings,
  Loader2,
} from 'lucide-react'
import type { Project } from '@/types'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const supabase = createClient()

  useEffect(() => {
    loadProject()
  }, [params.id])

  async function loadProject() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!data) {
        router.push('/dashboard/projects')
        return
      }

      setProject(data)
    } catch (err) {
      console.error('Error loading project:', err)
      router.push('/dashboard/projects')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'chat', label: 'Chat con IA', icon: MessageSquare },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'indicators', label: 'Indicadores', icon: BarChart3 },
    { id: 'risks', label: 'Riesgos', icon: AlertTriangle },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="mt-1 text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {project.status === 'draft'
              ? 'Borrador'
              : project.status === 'in_progress'
                ? 'En Progreso'
                : project.status === 'completed'
                  ? 'Completado'
                  : 'Enviado'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'chat' && (
        <div className="rounded-xl border bg-card p-6">
          <p className="text-center text-muted-foreground">
            El chat con IA se cargará aquí. Continúa tu conversación con KAIZEN
            para refinar tu proyecto.
          </p>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Sin documentos aún</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Los documentos generados aparecerán aquí
          </p>
        </div>
      )}

      {/* Project info card */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Información del Proyecto
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs text-muted-foreground">Metodología</span>
            <p className="text-sm font-medium">
              {project.methodology || 'No especificada'}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Entidad Objetivo</span>
            <p className="text-sm font-medium">
              {project.target_entity || 'No especificada'}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">País</span>
            <p className="text-sm font-medium">{project.country}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Versión</span>
            <p className="text-sm font-medium">v{project.version}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Creado</span>
            <p className="text-sm font-medium">
              {new Date(project.created_at).toLocaleDateString('es-CO')}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Actualizado</span>
            <p className="text-sm font-medium">
              {new Date(project.updated_at).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
