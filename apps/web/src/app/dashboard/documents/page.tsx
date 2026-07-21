'use client'

import { FileText, Upload, Plus } from 'lucide-react'
import Link from 'next/link'

export default function DocumentsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">Gestiona los documentos de tus proyectos</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed p-16 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Sin documentos aún</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Los documentos generados a partir de tus proyectos aparecerán aquí. Puedes exportar a PDF, DOCX y formatos oficiales.
        </p>
      </div>
    </div>
  )
}
