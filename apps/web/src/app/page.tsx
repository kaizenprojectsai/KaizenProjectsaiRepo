'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, FileText, Target, Bot, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'IA Conversacional',
    description:
      'Habla con KAIZEN como si fuera tu consultor. Haz preguntas, refina ideas y obtén respuestas inteligentes al instante.',
  },
  {
    icon: FileText,
    title: 'Proyectos Estructurados',
    description:
      'Transforma ideas sueltas en proyectos completos con metodología, presupuesto, cronograma y marco lógico.',
  },
  {
    icon: Target,
    title: 'Discovery Engine',
    description:
      'El sistema te guía con preguntas inteligentes para descubrir y estructurar cada aspecto de tu proyecto.',
  },
  {
    icon: Shield,
    title: 'Convocatorias Colombia',
    description:
      'Encuentra automáticamente las convocatorias que mejor se ajustan a tu proyecto (Fondo Emprender, iNNpulsa, MinCiencias).',
  },
  {
    icon: Users,
    title: '8 Agentes Expertos',
    description:
      'Directores Estratégico, Financiero, Jurídico, Comercial y más trabajando en equipo para tu proyecto.',
  },
  {
    icon: Sparkles,
    title: '100% Gratuito',
    description:
      'Toda la potencia de IA generativa sin costo. Solo necesitas tu idea y KAIZEN hace el resto.',
  },
]

const stats = [
  { value: '24', label: 'Objetos Raíz' },
  { value: '8', label: 'Agentes IA' },
  { value: '5', label: 'Fases de Construcción' },
  { value: '$0', label: 'Costo Mensual' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <span className="text-lg font-bold">KAIZEN</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Comenzar Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Plataforma de formulación de proyectos con IA</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Transforma tus ideas en{' '}
              <span className="text-primary">proyectos reales</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground lg:text-xl">
              KAIZEN Project AI es tu asistente inteligente para formular
              proyectos. Conversa con IA, estructura tu idea y prepárala para
              convocatorias en Colombia.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Comenzar Ahora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                Conocer Más
              </Link>
            </div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Todo lo que necesitas para formular proyectos
            </h2>
            <p className="mt-4 text-muted-foreground">
              KAIZEN reúne herramientas de IA, bases de conocimiento y
              metodologías en una sola plataforma.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            ¿Listo para empezar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            No necesitas tarjeta de crédito. Solo tu idea y las ganas de
            hacerla realidad.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Crear mi Primer Proyecto
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                K
              </span>
            </div>
            <span className="text-sm font-medium">KAIZEN Project AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KAIZEN Project AI. Gratuito y
            open source.
          </p>
        </div>
      </footer>
    </div>
  )
}
