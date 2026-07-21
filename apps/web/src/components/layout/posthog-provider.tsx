'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === 'undefined') return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV !== 'production') {
          ph.debug()
        }
      },
    })
  }, [])

  // Track page views
  useEffect(() => {
    if (pathname && POSTHOG_KEY) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      })
    }
  }, [pathname, searchParams])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
