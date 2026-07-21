'use client'

// Estilos de animación CSS en lugar de framer-motion
const fadeInStyle = {
  animation: 'fade-in 0.3s ease-out',
}
import { CheckCircle2, Loader2, AlertCircle, Play, Eye } from 'lucide-react'
import type { AgentResult } from '@/lib/agents/types'
import type { AgentRole } from '@/lib/agents/types'

interface DirectorConfig {
  role: AgentRole
  name: string
  icon: string
  color: string
  description: string
  systemPrompt: string
}

interface AgentCardProps {
  config: DirectorConfig
  result?: AgentResult | null
  isSelected: boolean
  onToggle: () => void
  onRun: () => void
}

const statusConfig = {
  pending: { icon: Play, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Pendiente' },
  processing: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950', label: 'Analizando...' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950', label: 'Completado' },
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950', label: 'Error' },
}

export function AgentCard({ config, result, isSelected, onToggle, onRun }: AgentCardProps) {
  const status = result?.status || 'pending'
  const StatusIcon = statusConfig[status].icon

  return (
    <div
      style={fadeInStyle}
      className={`group rounded-xl border bg-card p-4 transition-all cursor-pointer ${
        isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${config.color}`}>
            <span>{config.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">{config.name}</h3>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {status !== 'pending' && (
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {statusConfig[status].label}
          </div>
        )}
      </div>

      {/* Result summary */}
      {result?.summary && (
        <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
          {result.summary}
        </p>
      )}

      {/* Confidence bar */}
      {result && result.status === 'completed' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Confianza</span>
            <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${result.confidence * 100}%`, transition: 'width 1s ease-out' }}
              className={`h-full rounded-full ${
                result.confidence > 0.7 ? 'bg-emerald-500' :
                result.confidence > 0.4 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Warnings */}
      {result?.warnings && result.warnings.length > 0 && (
        <div className="mt-2 space-y-0.5">
          {result.warnings.slice(0, 2).map((w, i) => (
            <p key={i} className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {w}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {status === 'pending' && (
          <button
            onClick={(e) => { e.stopPropagation(); onRun() }}
            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Play className="h-3 w-3" />
            Ejecutar
          </button>
        )}
        {status === 'completed' && (
          <button
            onClick={(e) => { e.stopPropagation(); onRun() }}
            className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
          >
            <Eye className="h-3 w-3" />
            Ver detalle
          </button>
        )}
      </div>
    </div>
  )
}
