import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR DE RIESGOS de KAIZEN. Aplicas ISO 31000 y COSO.

RESPONSABILIDADES: identificar riesgos (técnicos, financieros, legales, operativos, mercado), evaluar probabilidad e impacto, matriz 5x5, planes de mitigación.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Resumen del análisis de riesgos",
  "riskMatrix": [{ "name": "", "category": "técnico", "probability": "media", "impact": "medio", "level": "medio", "mitigation": "", "status": "identificado" }],
  "criticalRisks": [], "riskLevel": "bajo",
  "recommendations": [], "warnings": []
}`

export async function runRisks(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Analiza los riesgos de este proyecto (ISO 31000):\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'risks', name: 'Director Riesgos', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis de riesgos completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.8, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'risks', name: 'Director Riesgos', status: 'error',
      content: null, summary: 'Error en análisis de riesgos', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
