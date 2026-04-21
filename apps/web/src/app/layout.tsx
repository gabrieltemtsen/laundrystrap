import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { headers } from 'next/headers'
import './globals.css'

function cssVarsFromTenantHeaders(h: Headers) {
  const primary = h.get('x-tenant-primary') || '#0B7A75'
  const accent = h.get('x-tenant-accent') || '#0F3460'
  const radius = h.get('x-tenant-radius') || '0.5rem'
  const font = h.get('x-tenant-font') || 'Inter'

  return `:root{--color-primary:${primary};--color-accent:${accent};--radius:${radius};--font-sans:${font},Inter,system-ui,sans-serif;}`
}

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'LaundryStrap — Never Lose a Garment Again',
  description:
    'Professional laundry service with photo verification and item tracking. Every garment photographed, tagged, and tracked.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const h = headers()
  const cssVars = cssVarsFromTenantHeaders(h)

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
