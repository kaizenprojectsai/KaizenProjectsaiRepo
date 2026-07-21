'use client'

import { FileText, Download, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { Decision } from '@/lib/agents/types'

interface ConsolidatedReportProps {
  report: string | null
  decisions: Decision[]
  loading?: boolean
}

export function ConsolidatedReport({ report, decisions, loading }: ConsolidatedReportProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!report && decisions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Decision Log */}
      {decisions.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Bitácora de Decisiones
          </h3>
          <div className="space-y-2">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm"
              >
                {decision.severity === 'critical' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                ) : decision.severity === 'warning' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                )}
                <div>
                  <p className="font-medium">{decision.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {decision.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-primary" />
              Expediente Consolidado
            </h3>
            <button
              onClick={() => {
                const blob = new Blob([report], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'informe-consolidado-kaizen.txt'
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar
            </button>
          </div>

          <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{
              __html: report
                .replace(/\n/g, '<br/>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/### (.*?)(?:<br\/>|$)/g, '<h4 class="text-base font-semibold mt-4 mb-2">$1</h4>')
                .replace(/## (.*?)(?:<br\/>|$)/g, '<h3 class="text-lg font-semibold mt-5 mb-2">$1</h3>')
                .replace(/# (.*?)(?:<br\/>|$)/g, '<h2 class="text-xl font-bold mt-6 mb-3 text-primary">$1</h2>')
                .replace(/• (.*?)(?:<br\/>|$)/g, '<li class="ml-4">$1</li>'),
            }}
          />
        </div>
      )}
    </div>
  )
}
