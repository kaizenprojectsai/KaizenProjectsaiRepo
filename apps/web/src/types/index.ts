// ============================================================
// KAIZEN PROJECT'S IA — TypeScript Types
// ============================================================

// --- User & Auth ---
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'owner' | 'admin' | 'member'
  organization_id: string | null
  preferences: Record<string, unknown>
  created_at: string
}

// --- Project ---
export interface Project {
  id: string
  organization_id: string
  created_by: string
  name: string
  description: string | null
  status: ProjectStatus
  methodology: string | null
  target_entity: string | null
  country: string
  metadata: Record<string, unknown>
  version: number
  is_archived: boolean
  created_at: string
  updated_at: string
}

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'submitted'

// --- Chat & Conversations ---
export interface Message {
  id: string
  project_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: {
    agent?: string
    model?: string
    tokens?: number
  }
  created_at: string
}

export interface Conversation {
  id: string
  project_id: string
  messages: Message[]
  created_at: string
}

// --- Document ---
export interface Document {
  id: string
  project_id: string
  name: string
  type: DocumentType
  content: string | null
  file_url: string | null
  status: DocumentStatus
  metadata: Record<string, unknown>
  version: number
  created_at: string
  updated_at: string
}

export type DocumentType =
  | 'project_formulation'
  | 'mgp'
  | 'mga'
  | 'pdf'
  | 'docx'
  | 'spreadsheet'

export type DocumentStatus = 'draft' | 'generating' | 'completed' | 'error'

// --- Knowledge Base ---
export interface KnowledgeEntry {
  id: string
  organization_id: string
  title: string
  content: string
  source: string | null
  domain: string | null
  confidence: number
  metadata: Record<string, unknown>
  created_at: string
}

// --- Agent ---
export interface Agent {
  id: string
  name: string
  role: AgentRole
  description: string | null
  model: string
  system_prompt: string | null
  tools: string[]
  config: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export type AgentRole =
  | 'strategic'
  | 'financial'
  | 'legal'
  | 'commercial'
  | 'research'
  | 'calls'
  | 'risks'
  | 'orchestrator'

// --- Calls (Convocatorias) ---
export interface Call {
  id: string
  title: string
  entity: string
  description: string
  budget: number | null
  deadline: string | null
  status: 'open' | 'closing_soon' | 'closed'
  requirements: string[]
  sectors: string[]
  regions: string[]
  url: string | null
  compatibility_score?: number
  created_at: string
}

// --- Indicators ---
export interface Indicator {
  id: string
  project_id: string
  name: string
  type: string
  value: number | null
  target: number | null
  unit: string | null
  formula: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// --- Risk ---
export interface Risk {
  id: string
  project_id: string
  name: string
  description: string | null
  category: string | null
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string | null
  status: 'identified' | 'mitigated' | 'monitoring'
  created_at: string
}

// --- API ---
export interface ChatRequest {
  projectId?: string
  message: string
  context?: Record<string, unknown>
}

export interface ChatResponse {
  message: string
  suggestions?: string[]
  metadata?: {
    agent?: string
    model?: string
    tokens?: number
  }
}

// --- Discovery ---
export interface DiscoveryQuestion {
  id: string
  question: string
  field: string
  type: 'text' | 'select' | 'multiselect' | 'number'
  options?: string[]
  required: boolean
}

export interface DiscoverySession {
  id: string
  projectId?: string
  currentStep: number
  answers: Record<string, unknown>
  questions: DiscoveryQuestion[]
  completed: boolean
}
