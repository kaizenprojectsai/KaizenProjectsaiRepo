import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'KAIZEN Project AI',
    template: '%s | KAIZEN Project AI',
  },
  description:
    'Plataforma inteligente de formulación de proyectos con IA. Transforma tus ideas en proyectos estructurados y elegibles para convocatorias.',
  keywords: [
    'proyectos',
    'IA',
    'formulación',
    'convocatorias',
    'Colombia',
    'KAIZEN',
    'emprendimiento',
  ],
  authors: [{ name: 'KAIZEN Project AI' }],
  creator: 'KAIZEN Project AI',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'KAIZEN Project AI',
    title: 'KAIZEN Project AI — Formulación de Proyectos con IA',
    description:
      'Transforma tus ideas en proyectos estructurados con ayuda de inteligencia artificial.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
