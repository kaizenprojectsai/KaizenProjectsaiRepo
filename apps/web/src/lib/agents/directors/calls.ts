import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR DE CONVOCATORIAS de KAIZEN. Identificas oportunidades de financiación en Colombia.

PRINCIPALES FUENTES: Fondo Emprender, iNNpulsa, MinCiencias, MinTIC, Regalías, Bancóldex.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Oportunidades encontradas",
  "opportunities": [{ "entity": "", "program": "", "compatibility": 85, "budget": 0, "deadline": "", "requirements": [], "status": "open" }],
  "recommendations": [], "warnings": []
}`

export async function runCalls(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Encuentra financiación para este proyecto en Colombia:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nEntidad: ${project.target_entity || 'No especificada'}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'calls', name: 'Director Convocatorias', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis de convocatorias completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.7, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'calls', name: 'Director Convocatorias', status: 'error',
      content: null, summary: 'Error en análisis de convocatorias', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
