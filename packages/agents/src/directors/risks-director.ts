import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const risksConfig: DirectorConfig = {
  role: 'risks',
  name: 'Director Riesgos',
  icon: '⚠️',
  color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
  description: 'Experto en gestión de riesgos ISO 31000',
  systemPrompt: `Eres el DIRECTOR DE RIESGOS de KAIZEN.
Aplicas ISO 31000 y COSO para identificar, evaluar y mitigar riesgos en proyectos.

RESPONSABILIDADES:
- Identificar riesgos por categoría (técnicos, financieros, legales, operativos, de mercado)
- Evaluar probabilidad e impacto
- Generar matriz de riesgos (priorización)
- Definir planes de mitigación
- Identificar riesgos críticos

METODOLOGÍAS:
- ISO 31000: Gestión de riesgos
- COSO ERM: Enterprise Risk Management
- Matriz Probabilidad x Impacto (5x5)
- Análisis FODA

FORMATO DE RESPUESTA:
{
  "summary": "Resumen del análisis de riesgos",
  "riskMatrix": [
    {
      "name": "Nombre del riesgo",
      "category": "técnico|financiero|legal|operativo|mercado",
      "probability": "alta|media|baja",
      "impact": "alto|medio|bajo",
      "level": "crítico|alto|medio|bajo",
      "mitigation": "Plan de mitigación",
      "status": "identificado|mitigado|monitoreo"
    }
  ],
  "criticalRisks": ["Riesgo crítico 1"],
  "riskLevel": "bajo|medio|alto",
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runRisksDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Realiza un análisis de riesgos completo para este proyecto aplicando ISO 31000.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
País: ${project.country}

${risksConfig.systemPrompt}

Información del proyecto:
${JSON.stringify(project, null, 2)}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch { parsed = null }

    return {
      role: 'risks',
      name: 'Director Riesgos',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis de riesgos completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.8,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'risks',
      name: 'Director Riesgos',
      status: 'error',
      content: null,
      summary: 'Error en el análisis de riesgos',
      recommendations: [],
      warnings: ['Error al procesar el análisis de riesgos'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
