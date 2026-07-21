import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR DE INVESTIGACIÓN de KAIZEN. Realizas estado del arte y vigilancia tecnológica.

RESPONSABILIDADES: estado del arte, marco teórico, benchmarking, tendencias, I+D+i.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Resumen",
  "stateOfTheArt": "", "theoreticalFramework": "",
  "benchmarking": [{ "name": "", "country": "", "keyFindings": "" }],
  "trends": [], "innovationComponent": "", "references": [],
  "recommendations": [], "warnings": []
}`

export async function runResearch(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Realiza investigación para este proyecto:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'research', name: 'Director Investigación', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis de investigación completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.75, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'research', name: 'Director Investigación', status: 'error',
      content: null, summary: 'Error en análisis de investigación', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
