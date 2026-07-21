import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, AgentResult, Decision } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Consolida los informes de todos los directores en un expediente único.
 * Detecta conflictos entre informes y genera un resumen ejecutivo.
 */
export async function consolidateResults(
  state: AgentState,
): Promise<{
  consolidated: string
  decisions: Decision[]
  success: boolean
}> {
  const decisions: Decision[] = []
  const results = state.agentResults

  // 1. Detectar conflictos entre agentes
  const conflicts = detectConflicts(results)

  if (conflicts.length > 0) {
    decisions.push({
      id: crypto.randomUUID(),
      agent: 'strategic',
      description: `${conflicts.length} conflicto(s) detectado(s) entre informes de directores`,
      reasoning: conflicts.join('. '),
      timestamp: new Date().toISOString(),
      severity: 'warning',
    })
  }

  // 2. Si hay conflictos, resolverlos con IA
  let resolution = ''
  if (conflicts.length > 0) {
    resolution = await resolveConflicts(results, conflicts)
    decisions.push({
      id: crypto.randomUUID(),
      agent: 'strategic',
      description: 'Conflictos resueltos por el Consolidador',
      reasoning: resolution,
      timestamp: new Date().toISOString(),
      severity: 'info',
    })
  }

  // 3. Generar expediente consolidado
  try {
    const consolidatedReport = await generateConsolidatedReport(results, resolution)
    
    decisions.push({
      id: crypto.randomUUID(),
      agent: 'strategic',
      description: 'Expediente consolidado generado exitosamente',
      reasoning: 'Todos los informes han sido integrados en un documento único',
      timestamp: new Date().toISOString(),
      severity: 'info',
    })

    return { consolidated: consolidatedReport, decisions, success: true }
  } catch (error) {
    decisions.push({
      id: crypto.randomUUID(),
      agent: 'strategic',
      description: 'Error al consolidar expediente',
      reasoning: 'No se pudo generar el expediente consolidado',
      timestamp: new Date().toISOString(),
      severity: 'critical',
    })
    return {
      consolidated: 'Error al generar el expediente consolidado',
      decisions,
      success: false,
    }
  }
}

/**
 * Detecta conflictos entre los informes de los diferentes directores.
 * Por ejemplo: Financiero dice presupuesto X, Estratégico dice Y.
 */
function detectConflicts(
  results: Partial<Record<string, AgentResult>>,
): string[] {
  const conflicts: string[] = []

  const strategic = results['strategic']
  const financial = results['financial']
  const risks = results['risks']

  if (strategic?.content && financial?.content) {
    // Buscar posibles conflictos en los textos
    const strategicText = strategic.content.toLowerCase()
    const financialText = financial.content.toLowerCase()

    if (
      strategicText.includes('presupuesto') &&
      financialText.includes('presupuesto')
    ) {
      // El consolidador los resolverá
      conflicts.push('Posible diferencia en estimaciones presupuestales entre Director Estratégico y Director Financiero')
    }
  }

  if (risks?.content && !risks.recommendations.length) {
    conflicts.push('El Director de Riesgos no generó recomendaciones de mitigación')
  }

  return conflicts
}

/**
 * Resuelve conflictos usando Gemini para mediar entre posturas.
 */
async function resolveConflicts(
  results: Partial<Record<string, AgentResult>>,
  conflicts: string[],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
  })

  const prompt = `Como CONSOLIDADOR del Consejo Estratégico KAIZEN, debes resolver los siguientes conflictos entre los informes de los directores:

CONFLICTOS:
${conflicts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

INFORMES DISPONIBLES:
${Object.entries(results)
  .filter(([_, r]) => r?.content)
  .map(([role, r]) => `${role.toUpperCase()}:\n${r!.content?.substring(0, 500)}...`)
  .join('\n\n')}

Proporciona una resolución concisa para cada conflicto. Responde en español.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * Genera el informe consolidado final integrando todos los análisis.
 */
async function generateConsolidatedReport(
  results: Partial<Record<string, AgentResult>>,
  resolution: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
  })

  const availableResults = Object.entries(results).filter(([_, r]) => r?.content)

  const prompt = `Eres el CONSOLIDADOR del Consejo Estratégico KAIZEN.
Tu misión es integrar TODOS los informes de los directores en un expediente único, coherente y profesional.

DIRECTRICES:
1. Identifica puntos en común entre los informes
2. Resuelve contradicciones
3. Prioriza recomendaciones
4. Genera un expediente unificado y accionable

${resolution ? `RESOLUCIÓN DE CONFLICTOS:\n${resolution}\n` : ''}

INFORMES DE LOS DIRECTORES:
${availableResults
  .map(([role, r]) => `=== ${r!.name?.toUpperCase()} ===\n${r!.content}\n`)
  .join('\n')}

GENERA UN EXPEDIENTE CONSOLIDADO CON:
1. RESUMEN EJECUTIVO (2-3 párrafos con lo más importante)
2. ANÁLISIS POR DIMENSIÓN (estratégica, financiera, jurídica, comercial, investigación, convocatorias, riesgos)
3. RECOMENDACIONES PRIORITARIAS (ordenadas por importancia)
4. PRÓXIMOS PASOS (acciones concretas a realizar)
5. DOCUMENTOS A GENERAR (listado de documentos necesarios)

Responde en español con formato profesional. Usa **negritas** para títulos y • para listas.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
