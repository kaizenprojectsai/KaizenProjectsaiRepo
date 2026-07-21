'use client'

import { ScrollText, Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function CallsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Convocatorias</h1>
        <p className="text-muted-foreground">
          Encuentra financiamiento para tu proyecto
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar convocatorias por entidad, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      <div className="rounded-xl border-2 border-dashed p-16 text-center">
        <ScrollText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Convocatorias disponibles próximamente</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Estamos integrando las bases de datos de Fondo Emprender, iNNpulsa Colombia,
          MinCiencias y más entidades. Muy pronto podrás encontrar aquí las mejores
          oportunidades para tu proyecto.
        </p>
      </div>
    </div>
  )
}
