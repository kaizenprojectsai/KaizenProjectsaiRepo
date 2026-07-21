'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Send, Bot, User, Sparkles, Loader2, Plus, ArrowLeft, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Message } from '@/types'

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  project_id: '',
  role: 'assistant',
  content: `# 👋 ¡Hola! Soy KAIZEN, tu asistente de formulación de proyectos.

Estoy aquí para ayudarte a **estructurar tu proyecto** desde cero. Cuéntame sobre tu idea y te guiaré paso a paso.

## ¿Por dónde empezamos?

Puedes contarme, por ejemplo:
- *"Quiero crear un restaurante sostenible en Medellín"*
- *"Tengo una idea para una app de reciclaje"*
- *"Necesito estructurar un proyecto agrícola para el Fondo Emprender"*

**¡Empieza cuando quieras!** 🚀`,
  created_at: new Date().toISOString(),
}

const SUGGESTED_QUESTIONS = [
  '¿Qué tipo de proyecto quieres crear?',
  '¿En qué sector o industria?',
  '¿Tienes algún objetivo específico?',
  '¿Para qué convocatoria o entidad?',
]

export default function NewProjectPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim() || loading) return

    // Guardar el nombre del proyecto si es el primer mensaje
    if (!projectName) {
      const name = messageContent.split('.')[0]?.split('\n')[0]?.trim() ?? ''
      setProjectName(name.substring(0, 60))
    }

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: crypto.randomUUID(),
      project_id: '',
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Llamar a la API de Gemini
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          context: {
            projectName,
            previousMessages: messages.slice(1).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Error al comunicarse con la IA')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        project_id: '',
        role: 'assistant',
        content:
          data.message ||
          'Lo siento, no pude procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        project_id: '',
        role: 'assistant',
        content:
          'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSaveProject = async () => {
    if (saving) return
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          name: projectName || 'Proyecto sin nombre',
          description: messages
            .filter((m) => m.role === 'user')
            .map((m) => m.content)
            .join('\n'),
          status: 'draft',
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Guardar mensajes
      const { error: msgError } = await supabase.from('conversations').insert(
        messages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            project_id: project.id,
            role: m.role,
            content: m.content,
          })),
      )

      if (msgError) console.error('Error saving messages:', msgError)

      router.push(`/dashboard/projects/${project.id}`)
    } catch (err) {
      console.error('Error saving project:', err)
      toast.error('Error al guardar el proyecto. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-lg p-2 hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">
              {projectName || 'Nuevo Proyecto'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Conversa con KAIZEN para estructurar tu proyecto
            </p>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleSaveProject}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {saving ? 'Guardando...' : 'Guardar Proyecto'}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div
                className={`prose prose-sm max-w-none ${
                  message.role === 'user'
                    ? 'prose-invert'
                    : 'dark:prose-invert'
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/#{1,3} (.*?)(?:<br\/>|$)/g, '<strong class="text-base block mt-2 mb-1">$1</strong>')
                    .replace(/- (.*?)(?:<br\/>|$)/g, '• $1<br/>'),
                }}
              />
            </div>

            {message.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
              <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-muted-foreground"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions (first message only) */}
      {messages.length === 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              className="rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
            rows={1}
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
