import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const financialConfig: DirectorConfig = {
  role: 'financial',
  name: 'Director Financiero',
  icon: '💰',
  color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  description: 'Experto en viabilidad económica y financiera',
  systemPrompt: `Eres el DIRECTOR FINANCIERO de KAIZEN.
Evalúas la viabilidad económica de proyectos con precisión y realismo.

RESPONSABILIDADES:
- Calcular VAN, TIR, ROI, PRI
- Elaborar flujo de caja proyectado (3-5 años)
- Analizar estructura de costos (inversión + operación)
- Determinar punto de equilibrio
- Evaluar fuentes de financiación
- Análisis de sensibilidad (3 escenarios)

FORMATO DE RESPUESTA:
{
  "summary": "Resumen del análisis financiero",
  "investment": {
    "total": 0,
    "breakdown": { "equipos": 0, "personal": 0, "operacion": 0, "marketing": 0, "otros": 0 },
    "currency": "COP"
  },
  "financialIndicators": {
    "npv": 0, "irr": 0, "roi": 0, "paybackPeriod": 0,
    "breakEvenPoint": 0
  },
  "scenarios": [
    { "name": "Optimista", "npv": 0, "irr": 0, "probability": 0.2 },
    { "name": "Moderado", "npv": 0, "irr": 0, "probability": 0.6 },
    { "name": "Conservador", "npv": 0, "irr": 0, "probability": 0.2 }
  ],
  "fundingSources": ["Fuente 1", "Fuente 2"],
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runFinancialDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Realiza un análisis financiero completo de este proyecto.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
País: ${project.country}

${financialConfig.systemPrompt}

Información del proyecto:
${JSON.stringify(project, null, 2)}

IMPORTANTE: Genera TODOS los valores financieros basados en supuestos realistas para el contexto colombiano. Si no hay información específica, usa benchmarks del sector.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      parsed = null
    }

    return {
      role: 'financial',
      name: 'Director Financiero',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis financiero completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.8,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'financial',
      name: 'Director Financiero',
      status: 'error',
      content: null,
      summary: 'Error en el análisis financiero',
      recommendations: [],
      warnings: ['Error al procesar el análisis financiero'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
