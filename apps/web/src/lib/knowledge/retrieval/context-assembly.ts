import type { RAGContext, SearchResult } from '../types'

/**
 * Ensambla el contexto RAG para inyectarlo en el prompt del LLM.
 */
export function buildContextFromResults(
  query: string,
  results: SearchResult[],
): RAGContext {
  return {
    chunks: results.map((r) => ({
      content: r.content,
      similarity: r.similarity,
      source: (r.metadata as any)?.source || 'Base de Conocimiento',
      domain: r.domain || 'general',
    })),
    confidence:
      results.length > 0
        ? results.reduce((acc, r) => acc + r.similarity, 0) / results.length
        : 0,
    query,
  }
}

/**
 * Construye el prompt enriquecido con contexto para el LLM.
 */
export function buildPromptWithContext(
  userMessage: string,
  context: RAGContext,
  systemPrompt?: string,
): string {
  if (context.chunks.length === 0) {
    return userMessage
  }

  const contextBlock = context.chunks
    .map(
      (chunk, i) =>
        `[Fuente ${i + 1}] (Confianza: ${(chunk.similarity * 100).toFixed(0)}% - ${chunk.domain})
${chunk.content}
`,
    )
    .join('\n')

  const basePrompt = systemPrompt || `Eres KAIZEN, un experto en formulación de proyectos.`

  return `${basePrompt}

## CONTEXTO RELEVANTE
${contextBlock}

> Confianza general del contexto: ${(context.confidence * 100).toFixed(0)}%
> Fuentes disponibles: ${context.chunks.length}

## INSTRUCCIONES
- Usa el contexto proporcionado como base para tu respuesta
- Siempre cita las fuentes que uses como [Fuente 1], [Fuente 2], etc.
- Si el contexto no es suficiente, dilo explícitamente
- No inventes información que no esté respaldada por el contexto
- Responde en español (Colombia) con un tono profesional pero amigable

## MENSAJE DEL USUARIO
${userMessage}

## RESPUESTA (cita las fuentes usadas):`
}
