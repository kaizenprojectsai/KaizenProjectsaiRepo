'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bot, Loader2 } from 'lucide-react'
import type { Agent } from '@/types'

const agentIcons: Record<string, string> = {
  strategic: '🎯',
  financial: '💰',
  legal: '⚖️',
  commercial: '📊',
  research: '🔬',
  calls: '📋',
  risks: '⚠️',
  orchestrator: '🤖',
}

const agentColors: Record<string, string> = {
  strategic: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  financial: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  legal: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  commercial: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  research: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  calls: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  risks: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
  orchestrator: 'bg-primary/10 text-primary',
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAgents()
  }, [])

  async function loadAgents() {
    try {
      const { data } = await supabase.from('agents').select('*').order('created_at')
      setAgents(data ?? [])
    } catch (err) {
      console.error('Error loading agents:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agentes IA</h1>
        <p className="text-muted-foreground">
          Equipo de agentes especializados trabajando para tu proyecto
        </p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : agents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    agentColors[agent.role] || 'bg-muted'
                  }`}
                >
                  {agentIcons[agent.role] || <Bot className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <span className="text-xs capitalize text-muted-foreground">
                    {agent.role}
                  </span>
                </div>
              </div>
              {agent.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {agent.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    agent.is_active ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {agent.is_active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {agent.model}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed p-16 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No hay agentes configurados</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ejecuta el seed de datos en Supabase para crear los agentes predeterminados
          </p>
        </div>
      )}
    </div>
  )
}
