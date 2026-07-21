'use client'

import { AlertTriangle, Plus } from 'lucide-react'

export default function RisksPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Riesgos</h1>
          <p className="text-muted-foreground">Identifica y mitiga los riesgos de tus proyectos</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed p-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Sin riesgos registrados</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          El Director de Riesgos analizará automáticamente tu proyecto y sugerirá
          los riesgos potenciales y sus mitigaciones.
        </p>
      </div>
    </div>
  )
}
