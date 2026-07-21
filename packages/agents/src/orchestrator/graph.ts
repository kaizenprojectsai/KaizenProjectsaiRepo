import type { AgentState, AgentPhase, AgentRole, AgentResult, Decision } from '../types'
import { runStrategicDirector } from '../directors/strategic-director'
import { runFinancialDirector } from '../directors/financial-director'
import { runLegalDirector } from '../directors/legal-director'
import { runCommercialDirector } from '../directors/commercial-director'
import { runResearchDirector } from '../directors/research-director'
import { runCallsDirector } from '../directors/calls-director'
import { runRisksDirector } from '../directors/risks-director'
import { consolidateResults } from './consolidator'

/**
 * Orquestador personalizado del sistema multi-agente.
 * Reemplaza LangGraph con un StateMachine ligero y controlado.
 * 
 * Flujo:
 *   start → strategic → financial → legal → commercial → research → calls → risks → consolidate → end
 */

type AgentRunner = (project: AgentState['project']) => Promise<AgentResult>
type AgentProgressCallback = (phase: AgentPhase, agent: AgentRole, result: AgentResult) => void

interface AgentNode {
  role: AgentRole
  phase: AgentPhase
  runner: AgentRunner
  dependsOn: AgentRole[]
}

// Definición del grafo de agentes
const AGENT_GRAPH: AgentNode[] = [
  { role: 'strategic', phase: 'strategic_analysis', runner: runStrategicDirector, dependsOn: [] },
  { role: 'financial', phase: 'financial_analysis', runner: runFinancialDirector, dependsOn: ['strategic'] },
  { role: 'legal', phase: 'legal_analysis', runner: runLegalDirector, dependsOn: ['financial'] },
  { role: 'commercial', phase: 'commercial_analysis', runner: runCommercialDirector, dependsOn: ['legal'] },
  { role: 'research', phase: 'research_analysis', runner: runResearchDirector, dependsOn: ['commercial'] },
  { role: 'calls', phase: 'calls_analysis', runner: runCallsDirector, dependsOn: ['research'] },
  { role: 'risks', phase: 'risks_analysis', runner: runRisksDirector, dependsOn: ['calls'] },
]

/**
 * Crea el estado inicial del sistema multi-agente.
 */
export function createInitialState(project: AgentState['project']): AgentState {
  return {
    project,
    currentPhase: 'idle',
    agentResults: {},
    pendingActions: [],
    decisionLog: [],
    errors: [],
  }
}

/**
 * Ejecuta el flujo completo de agentes para un proyecto.
 * 
 * @param project - Datos del proyecto a analizar
 * @param onAgentProgress - Callback opcional para recibir progreso en tiempo real
 * @param selectedAgents - Agentes específicos a ejecutar (opcional, por defecto todos)
 * @returns El estado final con todos los resultados
 */
export async function runAgentSystem(
  project: AgentState['project'],
  onAgentProgress?: AgentProgressCallback,
  selectedAgents?: AgentRole[],
): Promise<AgentState> {
  const state = createInitialState(project)
  const decisions: Decision[] = []
  const agentsToRun = selectedAgents
    ? AGENT_GRAPH.filter((a) => selectedAgents.includes(a.role))
    : AGENT_GRAPH

  for (const agent of agentsToRun) {
    state.currentPhase = agent.phase

    // Verificar dependencias
    const missingDeps = agent.dependsOn.filter(
      (dep) => !state.agentResults[dep] || state.agentResults[dep]?.status !== 'completed',
    )
    if (missingDeps.length > 0) {
      const errorMsg = `Saltando ${agent.role}: dependencias no cumplidas: ${missingDeps.join(', ')}`
      state.errors.push(errorMsg)
      decisions.push({
        id: crypto.randomUUID(),
        agent: agent.role,
        description: errorMsg,
        reasoning: 'Dependencias del grafo no satisfechas',
        timestamp: new Date().toISOString(),
        severity: 'warning',
      })
      continue
    }

    // Ejecutar el agente
    try {
      const result = await agent.runner(project)
      state.agentResults[agent.role] = result

      decisions.push({
        id: crypto.randomUUID(),
        agent: agent.role,
        description: `${agent.role === 'strategic' ? 'Director Estratégico' :
          agent.role === 'financial' ? 'Director Financiero' :
          agent.role === 'legal' ? 'Director Jurídico' :
          agent.role === 'commercial' ? 'Director Comercial' :
          agent.role === 'research' ? 'Director Investigación' :
          agent.role === 'calls' ? 'Director Convocatorias' :
          'Director Riesgos'} completó su análisis`,
        reasoning: result.summary || 'Análisis completado',
        timestamp: new Date().toISOString(),
        severity: result.warnings.length > 0 ? 'warning' : 'info',
      })

      onAgentProgress?.(agent.phase, agent.role, result)
    } catch (error) {
      const errorMsg = `Error ejecutando ${agent.role}: ${error instanceof Error ? error.message : 'Error desconocido'}`
      state.errors.push(errorMsg)
      decisions.push({
        id: crypto.randomUUID(),
        agent: agent.role,
        description: `Error en ${agent.role}`,
        reasoning: errorMsg,
        timestamp: new Date().toISOString(),
        severity: 'critical',
      })
    }
  }

  // Consolidar resultados
  state.currentPhase = 'consolidating'
  const consolidated = await consolidateResults(state)
  state.decisionLog = [...decisions, ...consolidated.decisions]
  state.currentPhase = consolidated.success ? 'completed' : 'error'

  return state
}

/**
 * Ejecuta un agente específico del grafo.
 */
export async function runSingleAgent(
  project: AgentState['project'],
  agentRole: AgentRole,
): Promise<{ result: AgentResult; decision: Decision }> {
  const agent = AGENT_GRAPH.find((a) => a.role === agentRole)
  if (!agent) {
    throw new Error(`Agente '${agentRole}' no encontrado`)
  }

  const result = await agent.runner(project)
  const decision: Decision = {
    id: crypto.randomUUID(),
    agent: agentRole,
    description: `${agent.role} ejecutado individualmente`,
    reasoning: result.summary || 'Análisis completado',
    timestamp: new Date().toISOString(),
    severity: result.warnings.length > 0 ? 'warning' : 'info',
  }

  return { result, decision }
}
