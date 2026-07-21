import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR FINANCIERO de KAIZEN. Evalúas la viabilidad económica de proyectos.

RESPONSABILIDADES: calcular VAN/TIR/ROI, flujo de caja, costos, punto de equilibrio, fuentes de financiación.

DEBES GENERAR UN JSON VÁLIDO:
{
  "summary": "Resumen del análisis",
  "investment": { "total": 0, "breakdown": {}, "currency": "COP" },
  "financialIndicators": { "npv": 0, "irr": 0, "roi": 0, "paybackPeriod": 0, "breakEvenPoint": 0 },
  "scenarios": [{ "name": "Optimista", "npv": 0, "irr": 0, "probability": 0.2 }],
  "fundingSources": [], "recommendations": [], "warnings": []
}`

export async function runFinancial(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Analiza financieramente este proyecto:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || ''}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'financial', name: 'Director Financiero', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis financiero completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.8, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'financial', name: 'Director Financiero', status: 'error',
      content: null, summary: 'Error en análisis financiero', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
