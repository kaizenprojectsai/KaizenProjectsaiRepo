export interface AgentState {
  project: {
    id: string
    name: string
    description: string | null
    methodology: string | null
    target_entity: string | null
    country: string
    metadata: Record<string, unknown>
  }
  currentPhase: AgentPhase
  agentResults: Partial<Record<AgentRole, AgentResult>>
  pendingActions: string[]
  decisionLog: Decision[]
  errors: string[]
}

export type AgentPhase =
  | 'idle' | 'strategic_analysis' | 'financial_analysis' | 'legal_analysis'
  | 'commercial_analysis' | 'research_analysis' | 'calls_analysis'
  | 'risks_analysis' | 'consolidating' | 'completed' | 'error'

export type AgentRole =
  | 'strategic' | 'financial' | 'legal' | 'commercial'
  | 'research' | 'calls' | 'risks'

export interface AgentResult {
  role: AgentRole
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  content: string | null
  summary: string | null
  recommendations: string[]
  warnings: string[]
  confidence: number
  startedAt: string | null
  completedAt: string | null
}

export interface Decision {
  id: string
  agent: string
  description: string
  reasoning: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

export interface AgentRunRequest {
  projectId: string
  projectData: AgentState['project']
  agents?: AgentRole[]
}
