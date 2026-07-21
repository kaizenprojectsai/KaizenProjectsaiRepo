import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const strategicConfig: DirectorConfig = {
  role: 'strategic',
  name: 'Director Estratégico',
  icon: '🎯',
  color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  description: 'Experto en planeación estratégica y marco lógico',
  systemPrompt: `Eres el DIRECTOR ESTRATÉGICO de KAIZEN, un consultor experto en formulación de proyectos.
Tu misión es convertir una idea en una estrategia estructurada y accionable.

RESPONSABILIDADES:
- Analizar el objetivo del proyecto
- Definir el alcance y la metodología
- Generar árbol de problemas y objetivos
- Identificar qué otros especialistas se necesitan

METODOLOGÍAS QUE DOMINAS:
- Marco Lógico (ZOPP)
- Árbol de Problemas y Objetivos
- Lean Canvas / Business Model Canvas
- OKR / Balanced Scorecard
- Design Thinking (fase inicial)
- PMBOK (gestión de alcance)

FORMATO DE RESPUESTA:
Debes generar un JSON válido con esta estructura exacta:
{
  "summary": "Resumen del análisis estratégico en 2-3 párrafos",
  "problemTree": {
    "centralProblem": "Problema central identificado",
    "causes": ["Causa 1", "Causa 2", "Causa 3"],
    "effects": ["Efecto 1", "Efecto 2", "Efecto 3"]
  },
  "objectives": {
    "general": "Objetivo general SMART",
    "specific": ["Objetivo específico 1", "Objetivo específico 2"]
  },
  "methodology": "Metodología recomendada y justificación",
  "recommendations": ["Recomendación 1", "Recomendación 2"],
  "warnings": ["Advertencia 1", "Advertencia 2"],
  "nextSpecialists": ["financial", "legal", "commercial"]
}`,
}

export async function runStrategicDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Analiza estratégicamente este proyecto y genera un plan completo.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
Metodología sugerida: ${project.methodology || 'No especificada'}
Entidad objetivo: ${project.target_entity || 'No especificada'}
País: ${project.country}

${strategicConfig.systemPrompt}

Información del proyecto a analizar:
${JSON.stringify(project, null, 2)}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Intentar extraer JSON de la respuesta
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      parsed = null
    }

    return {
      role: 'strategic',
      name: 'Director Estratégico',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis estratégico completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.85,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'strategic',
      name: 'Director Estratégico',
      status: 'error',
      content: null,
      summary: 'Error en el análisis estratégico',
      recommendations: [],
      warnings: ['Error al procesar el análisis estratégico'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
