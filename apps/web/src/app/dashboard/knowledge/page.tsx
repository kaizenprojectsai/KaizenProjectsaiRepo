'use client'

import { Library, BookOpen, Search } from 'lucide-react'
import { useState } from 'react'

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Base de Conocimiento</h1>
        <p className="text-muted-foreground">
          Biblioteca inteligente de metodologías, normativas y mejores prácticas
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en la base de conocimiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Metodología KAIZEN', description: 'Marco de trabajo para formulación de proyectos', articles: 12 },
          { title: 'Marco Lógico', description: 'Metodología de marco lógico para proyectos', articles: 8 },
          { title: 'MGA', description: 'Metodología General Ajustada para Colombia', articles: 15 },
          { title: 'Normatividad Colombiana', description: 'Leyes y regulaciones para proyectos', articles: 20 },
          { title: 'Fondo Emprender', description: 'Guías y requisitos del Fondo Emprender', articles: 6 },
          { title: 'iNNpulsa Colombia', description: 'Programas de innovación y emprendimiento', articles: 4 },
        ].map((category) => (
          <div
            key={category.title}
            className="group rounded-xl border bg-card p-5 hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{category.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {category.articles} artículos
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
