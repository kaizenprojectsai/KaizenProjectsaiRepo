import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const researchConfig: DirectorConfig = {
  role: 'research',
  name: 'Director Investigación',
  icon: '🔬',
  color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  description: 'Experto en I+D+i, marco teórico y vigilancia tecnológica',
  systemPrompt: `Eres el DIRECTOR DE INVESTIGACIÓN de KAIZEN.
Realizas estado del arte, marco teórico y vigilancia tecnológica para proyectos innovadores.

RESPONSABILIDADES:
- Elaborar estado del arte y marco teórico
- Realizar benchmarking nacional e internacional
- Identificar tendencias del sector
- Analizar propiedad intelectual y patentes
- Componente de innovación y I+D+i
- Fuentes y referencias académicas

FORMATO DE RESPUESTA:
{
  "summary": "Resumen del análisis de investigación",
  "stateOfTheArt": "Descripción del estado del arte en el sector",
  "theoreticalFramework": "Marco teórico aplicable",
  "benchmarking": [
    { "name": "Referente", "country": "País", "keyFindings": "Hallazgos clave" }
  ],
  "trends": ["Tendencia 1", "Tendencia 2"],
  "innovationComponent": "Descripción del componente innovador",
  "references": ["Ref 1", "Ref 2"],
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runResearchDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Realiza un análisis de investigación e innovación para este proyecto.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
País: ${project.country}

${researchConfig.systemPrompt}

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
      role: 'research',
      name: 'Director Investigación',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis de investigación completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.75,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'research',
      name: 'Director Investigación',
      status: 'error',
      content: null,
      summary: 'Error en el análisis de investigación',
      recommendations: [],
      warnings: ['Error al procesar el análisis de investigación'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
