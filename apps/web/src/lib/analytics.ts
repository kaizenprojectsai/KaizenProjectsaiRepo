import { useCallback } from 'react'
import posthog from 'posthog-js'

/**
 * Hook para trackear eventos de analytics.
 * Solo envía eventos si POSTHOG_KEY está configurado.
 */
export function useAnalytics() {
  const identify = useCallback((userId: string, properties?: Record<string, unknown>) => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    posthog.identify(userId, properties)
  }, [])

  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    posthog.capture(event, properties)
  }, [])

  const reset = useCallback(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    posthog.reset()
  }, [])

  return { identify, track, reset }
}

/**
 * Eventos de analytics del sistema.
 */
export const AnalyticsEvents = {
  // Auth
  SIGNUP: 'user_signup',
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',

  // Proyectos
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  PROJECT_EXPORTED: 'project_exported',

  // Chat
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_CONVERSATION_STARTED: 'chat_conversation_started',
  CHAT_AI_INTERACTION: 'chat_ai_interaction',

  // Agentes
  AGENTS_RUN: 'agents_run',
  AGENT_SINGLE_RUN: 'agent_single_run',
  AGENT_RESULTS_VIEWED: 'agent_results_viewed',

  // Conocimiento
  KNOWLEDGE_SEARCH: 'knowledge_search',
  KNOWLEDGE_INGEST: 'knowledge_ingest',
  KNOWLEDGE_RESULT_CLICKED: 'knowledge_result_clicked',

  // Documentos
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_GENERATED: 'document_generated',

  // UI
  THEME_TOGGLED: 'theme_toggled',
  SIDEBAR_NAVIGATION: 'sidebar_navigation',
} as const
