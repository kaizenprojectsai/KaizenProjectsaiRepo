import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { hybridSearch } from '@/lib/knowledge/retrieval/vector-search'
import { buildContextFromResults } from '@/lib/knowledge/retrieval/context-assembly'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres KAIZEN, un asistente de inteligencia artificial experto en formulación de proyectos. Tu misión es ayudar al usuario a estructurar su proyecto desde cero.

REGLAS:
1. Eres un consultor experto en proyectos - guía al usuario con preguntas inteligentes
2. Responde SIEMPRE en español (Colombia)
3. Usa un tono profesional pero amigable
4. Cuando el usuario comparta una idea, haz preguntas específicas para estructurarla
5. Ofrece sugerencias basadas en el contexto colombiano (Fondo Emprender, iNNpulsa, MinCiencias, etc.)
6. Siempre cita las fuentes del contexto cuando las uses [Fuente 1], [Fuente 2], etc.
7. Proporciona ejemplos concretos cuando sea relevante`

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Mensaje requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7, topP: 0.95, topK: 40, maxOutputTokens: 8192 },
    })

    // 🔥 Obtener organización del usuario para filtrar RAG por organización
    let organizationId: string | undefined
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single()
        organizationId = profile?.organization_id || undefined
      }
    } catch { /* Ignorar si no hay sesión */ }

    // 🔥 RAG: Buscar contexto relevante filtrado por organización
    const ragResults = await hybridSearch(message, {
      limit: 5,
      threshold: 0.5,
      organizationId,
    })

    const ragContext = buildContextFromResults(message, ragResults)
    const hasContext = ragContext.chunks.length > 0

    // Construir el prompt enriquecido con RAG (sin duplicar SYSTEM_PROMPT)
    const ragPrompt = hasContext
      ? `Contexto relevante de la base de conocimiento:
${ragContext.chunks.map((c, i) => `[Fuente ${i + 1}] (${(c.similarity * 100).toFixed(0)}% - ${c.domain})
${c.content}`).join('

')}

---

Mensaje del usuario:
${message}

Responde usando el contexto cuando sea relevante, citando las fuentes como [Fuente 1], [Fuente 2], etc. Si el contexto no es suficiente, responde con tu conocimiento pero indícalo.`
      : message

    // Construir historial
    const history = [
      { role: 'user' as const, parts: [{ text: SYSTEM_PROMPT }] },
      {
        role: 'model' as const,
        parts: [{ text: 'Entendido. Actuaré como KAIZEN con acceso a la base de conocimiento. Estoy listo para ayudar.' }],
      },
      ...(context?.previousMessages || []).map(
        (msg: { role: string; content: string }) => ({
          role: msg.role === 'assistant' ? 'model' : ('user' as const),
          parts: [{ text: msg.content }],
        }),
      ),
    ]

    const chat = model.startChat({
      history,
      generationConfig: { temperature: 0.7, topP: 0.95, topK: 40, maxOutputTokens: 8192 },
    })

    const result = await chat.sendMessageStream(ragPrompt)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Si hay contexto RAG, enviar metadata primero
          if (hasContext) {
            const metadata = `📚 *Usando ${ragContext.chunks.length} fuentes de la base de conocimiento*\n\n`
            controller.enqueue(new TextEncoder().encode(metadata))
          }

          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (err) {
          console.error('Error en streaming:', err)
          controller.enqueue(
            new TextEncoder().encode('\n\n⚠️ Error al generar la respuesta. Intenta de nuevo.'),
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error en chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Error al procesar el mensaje', message: 'Lo siento, tuve un problema al procesar tu mensaje.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
