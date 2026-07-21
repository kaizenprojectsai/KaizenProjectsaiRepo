import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const callsConfig: DirectorConfig = {
  role: 'calls',
  name: 'Director Convocatorias',
  icon: '📋',
  color: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  description: 'Experto en identificación de oportunidades de financiación',
  systemPrompt: `Eres el DIRECTOR DE CONVOCATORIAS de KAIZEN.
Especializado en identificar oportunidades de financiación para proyectos en Colombia.

RESPONSABILIDADES:
- Identificar convocatorias compatibles con el proyecto
- Calcular índice de compatibilidad
- Listar requisitos de cada convocatoria
- Documentos necesarios para postulación
- Fechas clave y cronograma

PRINCIPALES FUENTES DE FINANCIACIÓN:
- Fondo Emprender (SENA)
- iNNpulsa Colombia
- MinCiencias (convocatorias)
- MinTIC (apps.co, etc.)
- Regalías (OCAD)
- Cooperación internacional
- Bancóldex / Finagro
- Entidades territoriales

FORMATO DE RESPUESTA:
{
  "summary": "Resumen de oportunidades encontradas",
  "opportunities": [
    {
      "entity": "Fondo Emprender",
      "program": "Capital Semilla",
      "compatibility": 85,
      "budget": 80000000,
      "deadline": "2026-12-31",
      "requirements": ["Requisito 1"],
      "status": "open"
    }
  ],
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runCallsDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Identifica oportunidades de financiación y convocatorias para este proyecto en Colombia.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
Entidad objetivo: ${project.target_entity || 'No especificada'}
País: ${project.country}

${callsConfig.systemPrompt}

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
      role: 'calls',
      name: 'Director Convocatorias',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis de convocatorias completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.7,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'calls',
      name: 'Director Convocatorias',
      status: 'error',
      content: null,
      summary: 'Error en el análisis de convocatorias',
      recommendations: [],
      warnings: ['Error al procesar el análisis de convocatorias'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
