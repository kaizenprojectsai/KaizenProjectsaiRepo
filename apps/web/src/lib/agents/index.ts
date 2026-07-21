export type { AgentState, AgentPhase, AgentRole, AgentResult, Decision, AgentRunRequest } from './types'
export { runAgentSystem, createInitialState } from './orchestrator/graph'

export const ALL_DIRECTORS = [
  { role: 'strategic', name: 'Director Estratégico', icon: '🎯', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400', description: 'Planeación estratégica y marco lógico', systemPrompt: '' },
  { role: 'financial', name: 'Director Financiero', icon: '💰', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', description: 'Viabilidad económica y financiera', systemPrompt: '' },
  { role: 'legal', name: 'Director Jurídico', icon: '⚖️', color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400', description: 'Normativa colombiana', systemPrompt: '' },
  { role: 'commercial', name: 'Director Comercial', icon: '📊', color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400', description: 'Mercado y competencia', systemPrompt: '' },
  { role: 'research', name: 'Director Investigación', icon: '🔬', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400', description: 'I+D+i y vigilancia tecnológica', systemPrompt: '' },
  { role: 'calls', name: 'Director Convocatorias', icon: '📋', color: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400', description: 'Oportunidades de financiación', systemPrompt: '' },
  { role: 'risks', name: 'Director Riesgos', icon: '⚠️', color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400', description: 'Gestión de riesgos ISO 31000', systemPrompt: '' },
]
