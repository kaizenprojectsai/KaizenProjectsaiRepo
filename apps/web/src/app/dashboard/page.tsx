'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, FolderKanban, FileText, Bot, TrendingUp, ArrowRight } from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalDocuments: number
  aiInteractions: number
}

const defaultStats: DashboardStats = {
  totalProjects: 0,
  activeProjects: 0,
  totalDocuments: 0,
  aiInteractions: 0,
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: totalProjects } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })

        const { count: activeProjects } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_progress')

        const { count: totalDocuments } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })

        setStats({
          totalProjects: totalProjects ?? 0,
          activeProjects: activeProjects ?? 0,
          totalDocuments: totalDocuments ?? 0,
          aiInteractions: 42, // Placeholder
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [supabase])

  const statCards = [
    {
      label: 'Total Proyectos',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400',
      href: '/dashboard/projects',
    },
    {
      label: 'Proyectos Activos',
      value: stats.activeProjects,
      icon: TrendingUp,
      color:
        'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400',
      href: '/dashboard/projects',
    },
    {
      label: 'Documentos',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-950 dark:text-purple-400',
      href: '/dashboard/documents',
    },
    {
      label: 'Interacciones IA',
      value: stats.aiInteractions,
      icon: Bot,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400',
      href: '/dashboard/projects/new',
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a KAIZEN Project AI
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={card.color}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    card.value
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {card.label}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Acciones Rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/projects/new"
            className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Nuevo Proyecto con IA</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Conversa con KAIZEN para estructurar tu proyecto desde cero
            </p>
            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
              Comenzar <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link
            href="/dashboard/projects"
            className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Mis Proyectos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa y continúa tus proyectos anteriores
            </p>
            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
              Ver proyectos <ArrowRight className="h-3 w-3" />
            </div>
          </Link>

          <Link
            href="/dashboard/knowledge"
            className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Convocatorias</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Encuentra financiamiento para tu proyecto
            </p>
            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
              Explorar <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* Empty state (mostrar cuando no hay proyectos) */}
      {!loading && stats.totalProjects === 0 && (
        <div className="mt-8 rounded-xl border-2 border-dashed p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FolderKanban className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            Aún no tienes proyectos
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Crea tu primer proyecto y KAIZEN te guiará paso a paso para
          estructurarlo con IA.
        </p>
        <Link
          href="/dashboard/projects/new"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Crear mi Primer Proyecto
        </Link>
      </div>
      )}
    </div>
  )
}
