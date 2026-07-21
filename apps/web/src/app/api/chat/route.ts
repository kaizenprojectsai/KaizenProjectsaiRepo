import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres KAIZEN, un asistente de inteligencia artificial experto en formulación de proyectos. Tu misión es ayudar al usuario a estructurar su proyecto desde cero.

REGLAS:
1. Eres un consultor experto en proyectos - guía al usuario con preguntas inteligentes
2. Responde SIEMPRE en español (Colombia)
3. Usa un tono profesional pero amigable
4. Cuando el usuario comparta una idea, haz preguntas específicas para estructurarla:
   - ¿Cuál es el objetivo principal?
   - ¿Quién es el público objetivo?
   - ¿En qué región o ciudad se desarrollará?
   - ¿Cuál es el presupuesto estimado?
   - ¿Hay una convocatoria específica?
5. Ofrece sugerencias basadas en el contexto colombiano (Fondo Emprender, iNNpulsa, MinCiencias, etc.)
6. Si el usuario se desvía, gentilmente retoma el foco en la formulación del proyecto
7. Proporciona ejemplos concretos cuando sea relevante

FORMATO DE RESPUESTA:
- Usa **negritas** para términos importantes
- Usa • para listas
- Incluye emojis ocasionales para hacer la conversación más amigable
- Para respuestas largas, estructura en secciones`

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 },
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    // Construir historial
    const history = [
      {
        role: 'user' as const,
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model' as const,
        parts: [
          {
            text: 'Entendido. Actuaré como KAIZEN, el asistente experto en formulación de proyectos en Colombia. Estoy listo para ayudar.',
          },
        ],
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
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    const result = await chat.sendMessage(message)
    const response = result.response.text()

    return NextResponse.json({
      message: response,
    })
  } catch (error) {
    console.error('Error en chat API:', error)
    return NextResponse.json(
      {
        error: 'Error al procesar el mensaje',
        message:
          'Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?',
      },
      { status: 500 },
    )
  }
}
