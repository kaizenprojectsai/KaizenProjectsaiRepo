import type { AgentState, AgentPhase, AgentRole, AgentResult, Decision } from '../types'
import { runStrategic } from '../directors/strategic'
import { runFinancial } from '../directors/financial'
import { runLegal } from '../directors/legal'
import { runCommercial } from '../directors/commercial'
import { runResearch } from '../directors/research'
import { runCalls } from '../directors/calls'
import { runRisks } from '../directors/risks'
import { consolidateResults } from './consolidator'

type AgentRunner = (project: AgentState['project']) => Promise<AgentResult>

interface AgentNode {
  role: AgentRole
  phase: AgentPhase
  runner: AgentRunner
  dependsOn: AgentRole[]
}

const AGENT_GRAPH: AgentNode[] = [
  { role: 'strategic', phase: 'strategic_analysis', runner: runStrategic, dependsOn: [] },
  { role: 'financial', phase: 'financial_analysis', runner: runFinancial, dependsOn: ['strategic'] },
  { role: 'legal', phase: 'legal_analysis', runner: runLegal, dependsOn: ['financial'] },
  { role: 'commercial', phase: 'commercial_analysis', runner: runCommercial, dependsOn: ['legal'] },
  { role: 'research', phase: 'research_analysis', runner: runResearch, dependsOn: ['commercial'] },
  { role: 'calls', phase: 'calls_analysis', runner: runCalls, dependsOn: ['research'] },
  { role: 'risks', phase: 'risks_analysis', runner: runRisks, dependsOn: ['calls'] },
]

export function createInitialState(project: AgentState['project']): AgentState {
  return { project, currentPhase: 'idle', agentResults: {}, pendingActions: [], decisionLog: [], errors: [] }
}

export async function runAgentSystem(
  project: AgentState['project'],
  selectedAgents?: AgentRole[],
): Promise<AgentState> {
  const state = createInitialState(project)
  const decisions: Decision[] = []
  const agentsToRun = selectedAgents
    ? AGENT_GRAPH.filter((a) => selectedAgents.includes(a.role))
    : AGENT_GRAPH

  for (const agent of agentsToRun) {
    state.currentPhase = agent.phase

    const missingDeps = agent.dependsOn.filter(
      (dep) => !state.agentResults[dep] || state.agentResults[dep]?.status !== 'completed',
    )
    if (missingDeps.length > 0) {
      state.errors.push(`Saltando ${agent.role}: dependencias: ${missingDeps.join(', ')}`)
      continue
    }

    try {
      const result = await agent.runner(project)
      state.agentResults[agent.role] = result
      decisions.push({
        id: crypto.randomUUID(), agent: agent.role,
        description: `${agent.role} completó su análisis`,
        reasoning: result.summary || 'Análisis completado',
        timestamp: new Date().toISOString(),
        severity: result.warnings.length > 0 ? 'warning' : 'info',
      })
    } catch (error) {
      state.errors.push(`Error en ${agent.role}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      decisions.push({
        id: crypto.randomUUID(), agent: agent.role,
        description: `Error en ${agent.role}`,
        reasoning: 'Error durante la ejecución',
        timestamp: new Date().toISOString(), severity: 'critical',
      })
    }
  }

  state.currentPhase = 'consolidating'
  const consolidated = await consolidateResults(state)
  state.decisionLog = [...decisions, ...consolidated.decisions]
  state.currentPhase = consolidated.success ? 'completed' : 'error'

  return state
}
