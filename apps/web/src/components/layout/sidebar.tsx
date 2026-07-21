'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Bot,
  ScrollText,
  Target,
  AlertTriangle,
  Library,
  ChevronLeft,
} from 'lucide-react'

const navigation = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Proyectos',
    icon: FolderKanban,
    href: '/dashboard/projects',
  },
  {
    label: 'Documentos',
    icon: FileText,
    href: '/dashboard/documents',
  },
  {
    label: 'Agentes IA',
    icon: Bot,
    href: '/dashboard/agents',
  },
  {
    label: 'Convocatorias',
    icon: ScrollText,
    href: '/dashboard/calls',
  },
  {
    label: 'Indicadores',
    icon: Target,
    href: '/dashboard/indicators',
  },
  {
    label: 'Riesgos',
    icon: AlertTriangle,
    href: '/dashboard/risks',
  },
  {
    label: 'Base de Conocimiento',
    icon: Library,
    href: '/dashboard/knowledge',
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                K
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">KAIZEN</span>
              <span className="text-[10px] leading-tight text-muted-foreground">
                Project AI
              </span>
            </div>
          </Link>

          {/* Close button */}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 hover:bg-accent transition-colors lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick actions */}
        <div className="border-t p-3">
          <Link
            href="/dashboard/projects/new"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FolderKanban className="h-4 w-4" />
            Nuevo Proyecto
          </Link>
        </div>
      </aside>
    </>
  )
}
