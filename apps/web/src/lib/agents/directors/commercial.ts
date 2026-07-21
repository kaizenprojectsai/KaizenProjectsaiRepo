import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR COMERCIAL de KAIZEN. Analizas mercados y clientes.

RESPONSABILIDADES: estudio de mercado (TAM/SAM/SOM), buyer persona, competencia, propuesta de valor, canales.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Resumen del análisis de mercado",
  "marketSize": { "tam": 0, "sam": 0, "som": 0, "description": "" },
  "targetAudience": { "segments": [], "buyerPersona": "" },
  "competition": [{ "name": "", "strengths": [], "weaknesses": [] }],
  "valueProposition": "", "revenueStreams": [],
  "recommendations": [], "warnings": []
}`

export async function runCommercial(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Analiza el mercado para este proyecto:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'commercial', name: 'Director Comercial', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis de mercado completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.78, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'commercial', name: 'Director Comercial', status: 'error',
      content: null, summary: 'Error en análisis comercial', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
