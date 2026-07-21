import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, DirectorConfig } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const legalConfig: DirectorConfig = {
  role: 'legal',
  name: 'Director Jurídico',
  icon: '⚖️',
  color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  description: 'Experto en normativa colombiana y cumplimiento legal',
  systemPrompt: `Eres el DIRECTOR JURÍDICO de KAIZEN.
Especializado en normativa colombiana para proyectos y emprendimiento.

RESPONSABILIDADES:
- Identificar normativa aplicable (Ley 80, Ley 1150, Ley 1581)
- Verificar requisitos legales por tipo de proyecto
- Evaluar riesgos jurídicos
- Recomendar estructura legal
- Validar permisos y licencias necesarias

DOMINIOS LEGALES:
- Contratación estatal colombiana
- Propiedad intelectual y derechos de autor
- Protección de datos personales (Ley 1581)
- Derecho comercial / sociedades
- Normativa sectorial (salud, TIC, agrícola, etc.)
- Regulación de convocatorias (Fondo Emprender, MinCiencias, etc.)

FORMATO DE RESPUESTA:
{
  "summary": "Resumen del análisis jurídico",
  "applicableRegulations": [
    { "name": "Nombre de la norma", "type": "Ley/Decreto/Resolución", "description": "Descripción" }
  ],
  "legalRequirements": ["Requisito 1", "Requisito 2"],
  "legalStructure": "Estructura legal recomendada (SAS, SA, etc.)",
  "permitsAndLicenses": ["Permiso 1", "Permiso 2"],
  "recommendations": ["Recomendación 1"],
  "warnings": ["Advertencia 1"]
}`,
}

export async function runLegalDirector(
  project: AgentState['project'],
): Promise<AgentResult> {
  const startedAt = new Date().toISOString()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  })

  try {
    const prompt = `Realiza un análisis jurídico y normativo completo de este proyecto en Colombia.

PROYECTO:
Nombre: ${project.name}
Descripción: ${project.description || 'No especificada'}
Entidad objetivo: ${project.target_entity || 'No especificada'}
País: ${project.country}

${legalConfig.systemPrompt}

Información del proyecto:
${JSON.stringify(project, null, 2)}`

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
      role: 'legal',
      name: 'Director Jurídico',
      status: 'completed',
      content: text,
      summary: parsed?.summary || 'Análisis jurídico completado',
      recommendations: parsed?.recommendations || [],
      warnings: parsed?.warnings || [],
      confidence: 0.75,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'legal',
      name: 'Director Jurídico',
      status: 'error',
      content: null,
      summary: 'Error en el análisis jurídico',
      recommendations: [],
      warnings: ['Error al procesar el análisis jurídico'],
      confidence: 0,
      startedAt,
      completedAt: new Date().toISOString(),
    }
  }
}
