'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Send, Bot, User, Loader2, ArrowLeft, FileText, Square } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Message } from '@/types'

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  project_id: '',
  role: 'assistant',
  content: `**👋 ¡Hola! Soy KAIZEN,** tu asistente de formulación de proyectos.

Estoy aquí para ayudarte a **estructurar tu proyecto** desde cero. Cuéntame sobre tu idea y te guiaré paso a paso.

**¿Por dónde empezamos?**

Puedes contarme, por ejemplo:
• *"Quiero crear un restaurante sostenible en Medellín"*
• *"Tengo una idea para una app de reciclaje"*
• *"Necesito estructurar un proyecto agrícola para el Fondo Emprender"*

**¡Empieza cuando quieras!** 🚀`,
  created_at: new Date().toISOString(),
}

const SUGGESTED_QUESTIONS = [
  '¿Qué tipo de proyecto quieres crear?',
  '¿En qué sector o industria?',
  '¿Tienes algún objetivo específico?',
  '¿Para qué convocatoria o entidad?',
]

/** Convierte texto con formato simple a HTML */
function formatMessage(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*?)(?:<br\/>|$)/g, '<h4 class="text-base font-semibold mt-3 mb-1">$1</h4>')
    .replace(/## (.*?)(?:<br\/>|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-1">$1</h3>')
    .replace(/# (.*?)(?:<br\/>|$)/g, '<h2 class="text-xl font-bold mt-5 mb-2 text-primary">$1</h2>')
    .replace(/• (.*?)(?:<br\/>|$)/g, '<li class="ml-4">$1</li>')
    .replace(/\* (.*?)(?:<br\/>|$)/g, '<li class="ml-4">$1</li>')
    .replace(/\*(.*?)\*(?!\*)/g, '<em>$1</em>')
}

export default function NewProjectPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Estado para el mensaje que se está escribiendo en vivo
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Scroll automático al nuevo contenido
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const handleSend = useCallback(async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim() || loading || isStreaming) return

    // Guardar nombre del proyecto
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
    setIsStreaming(true)
    setStreamingContent('')

    // Crear AbortController para cancelar si es necesario
    const abortController = new AbortController()
    abortRef.current = abortController

    try {
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
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error('Error al comunicarse con la IA')
      }

      // Leer el stream de la respuesta
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No se pudo leer la respuesta')

      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk
        setStreamingContent(accumulatedText)
      }

      // Streaming completado — agregar el mensaje final
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        project_id: '',
        role: 'assistant',
        content: accumulatedText || 'No pude procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStreamingContent(null)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Usuario canceló - no mostrar error
        return
      }
      console.error('Chat error:', err)
      toast.error('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
      setIsStreaming(false)
      abortRef.current = null
      inputRef.current?.focus()
    }
  }, [input, loading, isStreaming, projectName, messages])

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
      const allMessages = [
        ...messages.filter((m) => m.id !== 'welcome').map((m) => ({
          project_id: project.id,
          role: m.role,
          content: m.content,
        })),
      ]
      if (allMessages.length > 0) {
        const { error: msgError } = await supabase
          .from('conversations')
          .insert(allMessages)
        if (msgError) console.error('Error saving messages:', msgError)
      }

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
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
                  message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'
                }`}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.content),
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

        {/* Streaming message en vivo */}
        {isStreaming && streamingContent !== null && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(streamingContent) + typingCursor,
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (only when no conversation started) */}
      {messages.length === 1 && !isStreaming && (
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
            placeholder={
              isStreaming
                ? 'KAIZEN está escribiendo...'
                : 'Escribe tu mensaje... (Enter para enviar)'
            }
            disabled={isStreaming}
            rows={1}
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none disabled:opacity-50"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
          <button
            onClick={() => {
              if (isStreaming && abortRef.current) {
                abortRef.current.abort()
                setIsStreaming(false)
                setLoading(false)
                // Si algo se acumuló, lo agregamos como mensaje
                if (streamingContent) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      project_id: '',
                      role: 'assistant',
                      content: streamingContent,
                      created_at: new Date().toISOString(),
                    },
                  ])
                  setStreamingContent(null)
                }
              } else {
                handleSend()
              }
            }}
            disabled={(!input.trim() && !isStreaming) || (loading && !isStreaming)}
            className="rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Square className="h-5 w-5" />
            ) : loading ? (
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

/** Cursor parpadeante al final del texto en streaming */
const typingCursor = `
  <span class="inline-block w-[2px] h-4 bg-primary ml-0.5" 
        style="animation: blink 0.8s step-end infinite; vertical-align: text-bottom;">
  </span>`
