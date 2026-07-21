// ============================================================
// KAIZEN AGENTS — Sistema Multi-Agente
// ============================================================

// Types
export type {
  AgentState,
  AgentPhase,
  AgentRole,
  AgentResult,
  Decision,
  DirectorConfig,
  AgentRunRequest,
  AgentRunResponse,
} from './types/index'

// Orchestrator
export {
  runAgentSystem,
  runSingleAgent,
  createInitialState,
} from './orchestrator/graph'
export { consolidateResults } from './orchestrator/consolidator'

// Directors
export { runStrategicDirector, strategicConfig } from './directors/strategic-director'
export { runFinancialDirector, financialConfig } from './directors/financial-director'
export { runLegalDirector, legalConfig } from './directors/legal-director'
export { runCommercialDirector, commercialConfig } from './directors/commercial-director'
export { runResearchDirector, researchConfig } from './directors/research-director'
export { runCallsDirector, callsConfig } from './directors/calls-director'
export { runRisksDirector, risksConfig } from './directors/risks-director'

// All director configs for UI
export const ALL_DIRECTORS = [
  { config: 'strategicConfig' as const, ...strategicConfig },
  { config: 'financialConfig' as const, ...financialConfig },
  { config: 'legalConfig' as const, ...legalConfig },
  { config: 'commercialConfig' as const, ...commercialConfig },
  { config: 'researchConfig' as const, ...researchConfig },
  { config: 'callsConfig' as const, ...callsConfig },
  { config: 'risksConfig' as const, ...risksConfig },
]
