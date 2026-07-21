import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
let embeddingModel: import('@google/generative-ai').GenerativeModel | null = null

function getEmbeddingModel() {
  if (!embeddingModel) {
    embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  }
  return embeddingModel
}

/**
 * Genera un embedding para un texto usando Gemini.
 * Retorna un array de 768 dimensiones.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel()
  const result = await model.embedContent(text.substring(0, 8000)) // max 8K chars (~2000 tokens)
  return result.embedding.values
}

/**
 * Genera embeddings en lote para múltiples textos.
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize = 10,
): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchEmbeddings = await Promise.all(
      batch.map((text) => generateEmbedding(text)),
    )
    embeddings.push(...batchEmbeddings)
  }
  
  return embeddings
}
