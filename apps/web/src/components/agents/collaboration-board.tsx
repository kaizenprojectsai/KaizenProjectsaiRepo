'use client'

import { useState, useCallback } from 'react'
import {
  Play,
  Loader2,
  Bot,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { AgentCard } from './agent-card'
import { ConsolidatedReport } from './consolidated-report'
import type { AgentResult, Decision, AgentRole } from '@/lib/agents/types'
import { ALL_DIRECTORS } from '@/lib/agents'

interface CollaborationBoardProps {
  projectData?: {
    id: string
    name: string
    description: string | null
    methodology: string | null
    target_entity: string | null
    country: string
  }
  onSaveResult?: (result: {
    agentResults: Partial<Record<AgentRole, AgentResult>>
    decisions: Decision[]
    consolidatedReport: string | null
  }) => void
}

export function CollaborationBoard({ projectData, onSaveResult }: CollaborationBoardProps) {
  const [selectedAgents, setSelectedAgents] = useState<Set<AgentRole>>(
    new Set(ALL_DIRECTORS.map((d) => d.role)),
  )
  const [results, setResults] = useState<Partial<Record<AgentRole, AgentResult>>>({})
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [consolidatedReport, setConsolidatedReport] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [runningAgent, setRunningAgent] = useState<AgentRole | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleAgent = useCallback((role: AgentRole) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })
  }, [])

  const runSelectedAgents = useCallback(async () => {
    if (!projectData || selectedAgents.size === 0) return
    setIsRunning(true)
    setError(null)
    setConsolidatedReport(null)

    try {
      const response = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectData.id,
          projectData,
          agents: Array.from(selectedAgents),
        }),
      })

      if (!response.ok) {
        throw new Error('Error al ejecutar los agentes')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error desconocido')
      }

      setResults(data.state.agentResults)
      setDecisions(data.state.decisionLog || [])

      // Extraer el reporte consolidado si existe
      const consolidatorResult = data.state.agentResults['consolidated']
      if (consolidatorResult?.content) {
        setConsolidatedReport(consolidatorResult.content)
      }

      onSaveResult?.({
        agentResults: data.state.agentResults,
        decisions: data.state.decisionLog || [],
        consolidatedReport: consolidatorResult?.content || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar agentes')
    } finally {
      setIsRunning(false)
      setRunningAgent(null)
    }
  }, [projectData, selectedAgents, onSaveResult])

  const runSingleAgent = useCallback(async (role: AgentRole) => {
    if (!projectData) return
    setRunningAgent(role)
    setError(null)

    try {
      const response = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectData.id,
          projectData,
          agents: [role],
        }),
      })

      if (!response.ok) throw new Error('Error al ejecutar el agente')

      const data = await response.json()

      if (!data.success) throw new Error(data.error || 'Error desconocido')

      setResults((prev) => ({
        ...prev,
        [role]: data.state.agentResults[role],
      }))
      setDecisions((prev) => [...prev, ...(data.state.decisionLog || [])])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar agente')
    } finally {
      setRunningAgent(null)
    }
  }, [projectData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Mesa Técnica — Consejo Estratégico</h2>
          <p className="text-sm text-muted-foreground">
            Selecciona los directores y ejecuta el análisis multi-agente
          </p>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </span>
          )}

          <button
            onClick={runSelectedAgents}
            disabled={isRunning || selectedAgents.size === 0 || !projectData}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Ejecutar {selectedAgents.size} Agente(s)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ALL_DIRECTORS.map((config) => (
          <AgentCard
            key={config.role}
            config={config}
            result={results[config.role] || null}
            isSelected={selectedAgents.has(config.role)}
            onToggle={() => toggleAgent(config.role)}
            onRun={() => runSingleAgent(config.role)}
          />
        ))}
      </div>

      {/* Overall progress */}
      {isRunning && (          <div className="rounded-xl border bg-card p-6 text-center">
          <div className="animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
            <Bot className="mx-auto h-12 w-12 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold">Consejo Estratégico en Sesión</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Los directores están analizando tu proyecto...
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {ALL_DIRECTORS.map((d) => (
              <div
                key={d.role}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  results[d.role]?.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-600'
                    : results[d.role]?.status === 'processing'
                      ? 'bg-blue-100 text-blue-600 animate-pulse'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {d.icon}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results: Decision Log + Consolidated Report */}
      {(decisions.length > 0 || consolidatedReport) && (
        <ConsolidatedReport
          report={consolidatedReport}
          decisions={decisions}
          loading={false}
        />
      )}

      {/* Empty state */}
      {Object.keys(results).length === 0 && !isRunning && (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Consejo Estratégico Listo</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Selecciona los directores que quieres convocar y haz clic en "Ejecutar".
            Cada director analizará el proyecto desde su especialidad y el
            Consolidador integrará todos los informes en un expediente único.
          </p>
        </div>
      )}

      {/* Summary stats */}
      {Object.keys(results).length > 0 && (
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {Object.values(results).filter((r) => r?.status === 'completed').length} completados
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {decisions.filter((d) => d.severity === 'warning').length} advertencias
          </span>
        </div>
      )}
    </div>
  )
}
