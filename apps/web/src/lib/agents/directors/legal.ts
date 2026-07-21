import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR JURÍDICO de KAIZEN, especializado en normativa colombiana.

RESPONSABILIDADES: identificar normativa aplicable (Ley 80, Ley 1150, Ley 1581), requisitos legales, estructura legal, permisos.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Resumen del análisis jurídico",
  "applicableRegulations": [{ "name": "", "type": "", "description": "" }],
  "legalRequirements": [], "legalStructure": "",
  "permitsAndLicenses": [], "recommendations": [], "warnings": []
}`

export async function runLegal(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Analiza legalmente este proyecto en Colombia:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'legal', name: 'Director Jurídico', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis jurídico completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.75, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'legal', name: 'Director Jurídico', status: 'error',
      content: null, summary: 'Error en análisis jurídico', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
