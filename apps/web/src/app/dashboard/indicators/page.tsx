'use client'

import { Target, Plus } from 'lucide-react'

export default function IndicatorsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Indicadores</h1>
          <p className="text-muted-foreground">Define y monitorea los indicadores de tus proyectos</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed p-16 text-center">
        <Target className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Sin indicadores aún</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Los indicadores de gestión, resultado e impacto se generarán automáticamente
          cuando estructures tu proyecto con KAIZEN.
        </p>
      </div>
    </div>
  )
}
