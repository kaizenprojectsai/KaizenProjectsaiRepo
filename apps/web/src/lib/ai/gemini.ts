import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY!

let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

let model: GenerativeModel | null = null
let embeddingModel: GenerativeModel | null = null

export function getModel(): GenerativeModel {
  if (!model) {
    model = getGenAI().getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })
  }
  return model
}

export function getProModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  })
}

export function getEmbeddingModel(): GenerativeModel {
  if (!embeddingModel) {
    embeddingModel = getGenAI().getGenerativeModel({
      model: 'text-embedding-004',
    })
  }
  return embeddingModel
}

export async function generateChatResponse(
  prompt: string,
  history?: Array<{ role: 'user' | 'model'; parts: { text: string }[] }>,
): Promise<string> {
  const chatModel = getModel()
  const chat = chatModel.startChat({
    history: history || [],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  })

  const result = await chat.sendMessage(prompt)
  return result.response.text()
}

export async function generateStreamingResponse(
  prompt: string,
  history?: Array<{ role: 'user' | 'model'; parts: { text: string }[] }>,
): Promise<ReadableStream<string>> {
  const chatModel = getModel()
  const chat = chatModel.startChat({
    history: history || [],
  })

  const result = await chat.sendMessageStream(prompt)

  // Convertir a ReadableStream estándar
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          controller.enqueue(text)
        }
      }
      controller.close()
    },
  })
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const embModel = getEmbeddingModel()
  const result = await embModel.embedContent(text)
  return result.embedding.values
}

export async function generateSystemPrompt(
  agentRole: string,
  context: string,
): Promise<string> {
  const prompt = `Eres un experto en formulación de proyectos. 
Como ${agentRole}, tu tarea es ayudar a estructurar un proyecto basado en el siguiente contexto:

${context}

Proporciona una respuesta estructurada y profesional siguiendo la metodología KAIZEN.`
  return prompt
}
