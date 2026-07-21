import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AgentState, Decision } from '../types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Consolida los informes de todos los directores en un expediente único.
 */
export async function consolidateResults(
  state: AgentState,
): Promise<{ consolidated: string; decisions: Decision[]; success: boolean }> {
  const decisions: Decision[] = []
  const results = state.agentResults

  // 1. Detectar conflictos
  const conflicts = detectConflicts(results)
  if (conflicts.length > 0) {
    decisions.push({
      id: crypto.randomUUID(), agent: 'strategic',
      description: `${conflicts.length} conflicto(s) detectado(s) entre informes`,
      reasoning: conflicts.join('. '), timestamp: new Date().toISOString(), severity: 'warning',
    })
  }

  // 2. Generar reporte consolidado
  try {
    const consolidatedReport = await generateConsolidatedReport(results, conflicts)
    decisions.push({
      id: crypto.randomUUID(), agent: 'strategic',
      description: 'Expediente consolidado generado exitosamente',
      reasoning: 'Todos los informes han sido integrados',
      timestamp: new Date().toISOString(), severity: 'info',
    })
    return { consolidated: consolidatedReport, decisions, success: true }
  } catch (error) {
    decisions.push({
      id: crypto.randomUUID(), agent: 'strategic',
      description: 'Error al consolidar expediente',
      reasoning: 'No se pudo generar el expediente consolidado',
      timestamp: new Date().toISOString(), severity: 'critical',
    })
    return { consolidated: 'Error al generar el expediente consolidado', decisions, success: false }
  }
}

function detectConflicts(results: Partial<Record<string, { content?: string | null; warnings?: string[]; recommendations?: string[] }>>): string[] {
  const conflicts: string[] = []
  if (results['risks'] && !results['risks']!.recommendations?.length) {
    conflicts.push('El Director de Riesgos no generó recomendaciones de mitigación')
  }
  return conflicts
}

async function generateConsolidatedReport(
  results: Partial<Record<string, { content?: string | null; name?: string }>>,
  conflicts: string[],
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
  })

  const availableResults = Object.entries(results).filter(([_, r]) => r?.content)
  
  const prompt = `Eres el CONSOLIDADOR del Consejo Estratégico KAIZEN.
Integra TODOS los informes en un expediente único.

${conflicts.length > 0 ? `CONFLICTOS A RESOLVER:\n${conflicts.join('\n')}\n` : ''}

INFORMES:
${availableResults.map(([role, r]) => `=== ${r?.name || role} ===\n${r?.content}\n`).join('\n')}

GENERA UN EXPEDIENTE CON:
1. RESUMEN EJECUTIVO
2. ANÁLISIS POR DIMENSIÓN (estratégica, financiera, jurídica, comercial, investigación, convocatorias, riesgos)
3. RECOMENDACIONES PRIORITARIAS
4. PRÓXIMOS PASOS
5. DOCUMENTOS A GENERAR

Usa **negritas** y • para listas. Responde en español.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
