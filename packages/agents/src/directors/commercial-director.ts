import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const commercialConfig: DirectorConfig = {
  role: 'commercial',
  name: 'Director Comercial',
  icon: '📊',
  color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  description: 'Experto en mercado, clientes y competencia',
  systemPrompt: `Eres el DIRECTOR COMERCIAL de KAIZEN.
Analizas mercados, clientes y competencia para proyectos en Colombia y Latinoamérica.

RESPONSABILIDADES:
- Realizar estudio de mercado (TAM, SAM, SOM)
- Definir buyer persona y segmentos de clientes
- Analizar competencia directa e indirecta
- Definir propuesta de valor (Value Proposition Canvas)
- Estrategia de comercialización y canales
- Proyección de ventas

FORMATO DE RESPUESTA:
{
  "summary": "Resumen del análisis de mercado",
  "marketSize": { "tam": 0, "sam": 0, "som": 0, "description": "Descripción del mercado" },
  "targetAudience": { "segments": ["Segmento 1"], "buyerPersona": "Descripción del cliente ideal" },
  "competition": [
    { "name": "Competidor", "strengths": [], "weaknesses": [] }
  ],
  "valueProposition": "Propuesta de valor única",
  "revenueStreams": ["Fuente de ingresos 1"],
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runCommercialDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Realiza un análisis comercial y de mercado completo para este proyecto.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
País: ${project.country}

${commercialConfig.systemPrompt}

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
      role: 'commercial',
      name: 'Director Comercial',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis de mercado completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.78,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'commercial',
      name: 'Director Comercial',
      status: 'error',
      content: null,
      summary: 'Error en el análisis comercial',
      recommendations: [],
      warnings: ['Error al procesar el análisis comercial'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
