import { ConvexReactClient } from 'convex/react'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) {
  // Avoid crashing build; runtime will still throw if used without config.
  console.warn('Missing NEXT_PUBLIC_CONVEX_URL')
}

export const convex = new ConvexReactClient(convexUrl || 'http://localhost:3210')
