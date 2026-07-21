import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Eres el DIRECTOR ESTRATÉGICO de KAIZEN, un consultor experto en formulación de proyectos.
Tu misión es convertir una idea en una estrategia estructurada.

RESPONSABILIDADES:
- Analizar el objetivo del proyecto
- Definir el alcance y la metodología
- Generar árbol de problemas y objetivos
- Identificar qué otros especialistas se necesitan

DEBES GENERAR UN JSON VÁLIDO con esta estructura:
{
  "summary": "Resumen del análisis estratégico",
  "problemTree": {
    "centralProblem": "Problema central",
    "causes": ["Causa 1"],
    "effects": ["Efecto 1"]
  },
  "objectives": {
    "general": "Objetivo general SMART",
    "specific": ["Objetivo específico 1"]
  },
  "methodology": "Metodología recomendada",
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"],
  "nextSpecialists": ["financial"]
}`

export async function runStrategic(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const result = await model.generateContent(
      `Analiza estratégicamente este proyecto:\n\nPROYECTO:\nNombre: ${project.name}\nDescripción: ${project.description || 'No especificada'}\nMetodología: ${project.methodology || 'No especificada'}\nPaís: ${project.country}\n\n${SYSTEM_PROMPT}\n\nDatos: ${JSON.stringify(project)}`,
    )
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return {
      role: 'strategic', name: 'Director Estratégico', status: 'completed',
      content: text, summary: parsed?.summary || 'Análisis estratégico completado',
      recommendations: parsed?.recommendations || [], warnings: parsed?.warnings || [],
      confidence: 0.85, startedAt, completedAt: new Date().toISOString(),
    }
  } catch {
    return { role: 'strategic', name: 'Director Estratégico', status: 'error',
      content: null, summary: 'Error en análisis estratégico', recommendations: [],
      warnings: ['Error al procesar'], confidence: 0, startedAt, completedAt: new Date().toISOString() }
  }
}
